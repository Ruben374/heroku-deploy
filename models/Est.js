const mongoose = require('mongoose')

const EstSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    require: true
  },
  name: {
    type: String,
    require: true
  },
  nif: {
    type: String,
    require: true
  },
  img: {
    type: String
  },
  accession_date: {
    type: String,
    require: true
  },
  phone_number: {
    type: Array
  },
  open_to: {
    type: Object,
    require: true
  },
  address: {
    type: Object,
    require: true
  }
})
const Est = mongoose.model('Est', EstSchema)
module.exports = Est
