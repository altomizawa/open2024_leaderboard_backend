const mongoose = require("mongoose");

const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'User'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 4,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 4,
  }
})

module.exports = mongoose.model('User', userSchema)