const mongoose = require('mongoose')

const ServicesSchema = new mongoose.Schema({
  estId: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'ests',
    require: true
  },
  name: {
    type: String,
    require: true
  },
  preco: {
    type: String,
    require: true
  },
  horarios: {
    type: Array,
    require: true
  }
})
const Services = mongoose.model('Services', ServicesSchema)
module.exports = Services
