const mongoose = require('mongoose');

const WishSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  wishType: {
    type: String,
    enum: ['Birthday', 'Anniversary', 'Holiday', 'Other'], // Define specific types
    default: 'Other',
  },
  wishDate: {
    type: Date,
    required: true,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentDate: {
    type: Date,
  }
}, {
  timestamps: true
});

const Wish = mongoose.model('Wish', WishSchema);

module.exports = Wish;
