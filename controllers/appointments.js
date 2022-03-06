const mongoose = require('mongoose')
const Appointments = require('../models/Appointments')
const Services = require('../models/Services')
const User = require('../models/Clients')
const Est = require('../models/Est')

exports.post = async (req, res, next) => {
  try {
    const { estid, clientid, serviceid, date, hour } = req.body

    const client = await User.find({ _id: clientid }, { _id: 1, name: 1 })

    const est = await Est.find(
      { _id: estid },
      { _id: 1, name: 1, address: 1, phone_number: 1 }
    )

    const service = await Services.find(
      { _id: serviceid },
      { _id: 1, name: 1, preco: 1 }
    )
    console.log(service[0].preco)

    const appointments = new Appointments({
      estid: estid,
      estname: est[0].name,
      clientid: clientid,
      clientname: client[0].name,
      serviceid: serviceid,
      servicename: service[0].name,
      servicepreco: service[0].preco,
      date: date,
      hour: hour,
      address: est[0].address,
      phone_number: est[0].phone_number
    })
    const re = await Appointments.create(appointments)

    return res.status(200).send({ message: 'agendamento criado' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.get = async (req, res, next) => {
  try {
    const clientid = req.params.id
    const c = 'f'
    const agendamentos = await Appointments.find({ clientid: clientid })
    return res.status(201).send(agendamentos)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
