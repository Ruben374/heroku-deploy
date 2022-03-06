const mongoose = require('mongoose')

const AppointmentsSchema = new mongoose.Schema({
  estid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  estname: {
    type: String,
     require:true
  },
  clientid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  clientname: {
    type: String,
     require:true
  },
  serviceid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  servicename: {
    type: String,
     require:true
  },
  servicepreco: {
    type: String,
    require:true
  },
  date: {
    type: String,
    require: true
  },
  hour: {
    type: String,
    required: true
  },
   address: {
    type: Object,
    require: true
  },
  phone_number:{
    type:Array,
    require:true
  }
})

const Appointments = mongoose.model('appointments', AppointmentsSchema)

module.exports = Appointments
