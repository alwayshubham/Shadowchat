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
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
      validate: {
        validator: function (v) {
          return (
            Array.isArray(v) &&
            v.length === 2 &&
            typeof v[0] === 'number' &&
            typeof v[1] === 'number' &&
            !isNaN(v[0]) &&
            !isNaN(v[1])
          );
        },
        message: 'Coordinates must be [lng, lat] numbers'
      }
    }
  }
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('User', UserSchema);
