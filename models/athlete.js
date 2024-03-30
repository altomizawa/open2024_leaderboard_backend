const mongoose = require('mongoose');

const validator = require('validator');

const athleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        default: 'The Athlete'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Custom synchronous validator using Validator.js
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    category: {
      type: String,
    required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    wodOneTime: {
      type: Number,
      default: 0,
    },
    wodOneResult: {
      type: Number,
      default: 0,
    },
    wodTwoResult: {
    type: Number,
    default: 0,
  },
    wodThreeTime: {
    type: Number,
    default: 0,
  },
    wodThreeResult: {
    type: Number,
  default: 0,},
})

module.exports = mongoose.model('Athlete', athleteSchema)