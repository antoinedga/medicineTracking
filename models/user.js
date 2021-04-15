/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');
const config = require('../config');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 64,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
      },
    ],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {timestamps: true});

userSchema.methods.authPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};


userSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if (this._update.password) {
      const hashed = await bcrypt.hash(
          this._update.password,
          config.saltRounds);
      this._update.password = hashed;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('user', userSchema);
