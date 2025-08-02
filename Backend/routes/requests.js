const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a new book request
// @access  Private
router.post('/', auth, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters'),
  body('exchangeBookId').optional().notEmpty().withMessage('Exchange book ID cannot be empty if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, message, exchangeBookId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available for exchange' });
    }

    // Check if user is requesting their own book
    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    // Check if exchange book exists and belongs to requester (if provided)
    let exchangeBook = null;
    if (exchangeBookId) {
      exchangeBook = await Book.findById(exchangeBookId);
      if (!exchangeBook) {
        return res.status(404).json({ message: 'Exchange book not found' });
      }
      if (exchangeBook.owner.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Exchange book must belong to you' });
      }
      if (!exchangeBook.isAvailable) {
        return res.status(400).json({ message: 'Exchange book is not available' });
      }
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      requester: req.user.id,
      book: bookId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists for this book' });
    }

    const request = new Request({
      requester: req.user.id,
      bookOwner: book.owner,
      book: bookId,
      message: message || '',
      exchangeBook: exchangeBookId || null,
      exchangeMessage: req.body.exchangeMessage || ''
    });

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('requester', 'username avatar')
      .populate('bookOwner', 'username avatar')
      .populate('book', 'title author condition image')
      .populate('exchangeBook', 'title author condition image');

    res.json(populatedRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/received
// @desc    Get requests received by user
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await Request.find({ bookOwner: req.user.id })
      .populate('requester', 'username avatar bio location')
      .populate('book', 'title author condition image')
      .populate('exchangeBook', 'title author condition image')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/sent
// @desc    Get requests sent by user
// @access  Private
router.get('/sent', auth, async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .populate('bookOwner', 'username avatar bio location')
      .populate('book', 'title author condition image')
      .populate('exchangeBook', 'title author condition image')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status (accept/decline)
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the book owner
    if (request.bookOwner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    request.status = status;
    await request.save();

    // If accepted, mark books as unavailable
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(request.book, { isAvailable: false });
      if (request.exchangeBook) {
        await Book.findByIdAndUpdate(request.exchangeBook, { isAvailable: false });
      }
    }

    const populatedRequest = await Request.findById(request._id)
      .populate('requester', 'username avatar')
      .populate('bookOwner', 'username avatar')
      .populate('book', 'title author condition image')
      .populate('exchangeBook', 'title author condition image');

    res.json(populatedRequest);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Cancel a request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the requester
    if (request.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Only allow cancellation of pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel processed request' });
    }

    await request.remove();
    res.json({ message: 'Request cancelled' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/:id
// @desc    Get request by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'username avatar bio location')
      .populate('bookOwner', 'username avatar bio location')
      .populate('book', 'title author condition image description')
      .populate('exchangeBook', 'title author condition image description');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is involved in the request
    if (request.requester.toString() !== req.user.id && request.bookOwner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 