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
    const re = await Services.create(services);
    const estup = await Est.findOne({ _id: est._id });
    console.log(estup)
    estup.services.push(services);
    //console.log(est._id)
    await Est.updateOne({_id:est._id},estup)
    return res.status(201).send(services);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
};
exports.get = async (req, res, next) => {
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
