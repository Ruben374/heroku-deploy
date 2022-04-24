const mongoose = require('mongoose')

const ratesSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients',
    require: true
  },
  estId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ests',
    require: true
  },
  rate: {
    type: Number,
    require: true
  }
})

const rates = mongoose.model('rates', ratesSchema)

module.exports = rates
