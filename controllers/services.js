const mongoose = require('mongoose')
const Services = require('../models/Services')

exports.post = async (req, res, next) => {
 // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']

  const { name, estId, preco, horarios } = req.body
  try {
    const services = new Services({
      name,
      estId,
      preco,
      horarios
    })
    const re = await Services.create(services)
    return res.status(201).send({ message: 'Serviço criada com sucesso' })
  } catch (error) {
      console.log(error.message)
    return res.status(500).send({ error: message })
  }
}
exports.get = async (req, res, next) => {
 // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
  try{
    const services = await Services.find({estId:req.params.id})
    return res.status(201).send(services)
  } catch (error) {
      console.log(error.message)
    return res.status(500).send({ error: message })
  }
}
exports.getService = async (req, res, next) => {
  // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
   try{
     const services = await Services.find({_id:req.params.id})
     return res.status(201).send(services)
   } catch (error) {
       console.log(error.message)
     return res.status(500).send({ error: message })
   }
 }
