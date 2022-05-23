const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    default: ''
  },
  resetPasswordCode: {
    type: String,
    default: ''
  },
  favorites: {
    type: Array,
    default: []
  },
}, { timestamps: true })

const client = mongoose.model('clients', clientSchema)

module.exports = client
