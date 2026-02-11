const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  anonymousName: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
