const mongoose = require('mongoose')

const ratesSchema = new mongoose.Schema({
  client: {
    type: Object,
    require: true
  },
  est: {
    type: Object,
    require: true
  },
  rate: {
    type: Number,
    require: true
  },
  comment: {
    type: String,
    require: true
  }
},{timestamps:true})

const rates = mongoose.model('rates', ratesSchema)

module.exports = rates
