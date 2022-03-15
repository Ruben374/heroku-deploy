const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    unique: true
  }
})

const client = mongoose.model('clients', clientSchema)

module.exports = client
