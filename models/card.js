const validator = require('validator');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: 'Must be a valid URL',
    },

    // validate: validators.isURL({message: 'Must be a Valid URL',
    // protocols: ['http','https','ftp'],
    // require_tld: true,
    // require_protocol: true })

    // validator: [validator.isURL({
    //   message: 'Must be a valid URL',
    //   protocols: ['http', 'https', 'ftp'],
    // })],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
