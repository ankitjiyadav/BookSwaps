const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/books
// @desc    Get all books with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, condition, genre, owner } = req.query;
    const filter = { isAvailable: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (condition) {
      filter.condition = condition;
    }

    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    if (owner) {
      filter.owner = owner;
    }

    const books = await Book.find(filter)
      .populate('owner', 'username avatar location')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'username avatar bio location');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Create a new book
// @access  Private
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    console.log('POST /api/books - Request received');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, description, condition, genre, isbn, year, language } = req.body;
    
    const bookFields = {
      title,
      author,
      description: description || '',
      condition,
      genre: genre || '',
      isbn: isbn || '',
      year: year || null,
      language: language || 'English',
      owner: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    };

    console.log('Book fields:', bookFields);

    const book = new Book(bookFields);
    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('owner', 'username avatar location');

    console.log('Book saved successfully:', populatedBook);
    res.json(populatedBook);
  } catch (error) {
    console.error('Error in POST /api/books:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private
router.put('/:id', auth, upload.single('image'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('condition').optional().isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check ownership
    if (book.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, author, description, condition, genre, isbn, year, language, isAvailable } = req.body;
    
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (author !== undefined) updateFields.author = author;
    if (description !== undefined) updateFields.description = description;
    if (condition !== undefined) updateFields.condition = condition;
    if (genre !== undefined) updateFields.genre = genre;
    if (isbn !== undefined) updateFields.isbn = isbn;
    if (year !== undefined) updateFields.year = year;
    if (language !== undefined) updateFields.language = language;
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (req.file) updateFields.image = `/uploads/${req.file.filename}`;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('owner', 'username avatar location');

    res.json(updatedBook);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check ownership
    if (book.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete image file if exists
    if (book.image && book.image !== '') {
      const imagePath = path.join(__dirname, '..', book.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/user/my-books
// @desc    Get user's own books
// @access  Private
router.get('/user/my-books', auth, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id })
      .populate('owner', 'username avatar location')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 