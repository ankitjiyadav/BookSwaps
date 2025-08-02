const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  exchangeBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null
  },
  exchangeMessage: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure requester and bookOwner are different
requestSchema.pre('save', function(next) {
  if (this.requester.toString() === this.bookOwner.toString()) {
    return next(new Error('Cannot request your own book'));
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema); 