const mongoose = require("mongoose");
const Services = require("../models/Services");
const Est = require("../models/Est");
const { est } = require("./est");

exports.post = async (req, res, next) => {
  // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
  const { name, est, preco, horarios } = req.body;
  try {
    const services = new Services({
      name,
      est,
      preco,
      horarios,
    });
    const response = await Services.create(services);
    return res.status(201).send({ status: 201, services: services });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
}; exports.get = async (req, res, next) => {
  // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
  try {
    const services = await Services.find({ estId: req.params.id });
    return res.status(201).send(services);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
};
exports.getService = async (req, res, next) => {
  // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
  try {
    const services = await Services.find({ _id: req.params.id });
    return res.status(201).send(services);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
};




exports.UpdateService = async (req, res, next) => {
  try {
    const service = req.body.service
    const id = req.params.id
    const serviceExists = await Services.findOne({ _id: id })
    if (!serviceExists) {
      return res.status(404).send({ message: "not found" })
    }
    await Services.updateOne({ _id: id }, service);
    return res.status(200).send({ status: 200, service: service })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.DeleteService = async (req, res, next) => {
  try {
    const id = req.params.id
    const serviceExists = await Services.findOne({ _id: id })
    if (!serviceExists) {
      return res.status(404).send({ message: "not found" })
    }
    await Services.delteOne({ _id: id });
    return res.status(200).send({ status: 200, message: "serviço apagado" })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}




