const mongoose = require("mongoose");
const Services = require("../models/Services");
const Appointments = require("../models/Appointments");
const Est = require("../models/Est");
const { est } = require("./est");

exports.post = async (req, res, next) => {
  try {
    const { name, est, preco, hours } = req.body;

    const services = new Services({
      name,
      est,
      preco,
      horarios: hours,
    });

    const response = await Services.create(services);
    if (response)
      return res.status(201).send({ message: "Serviço criado com sucesso." });

    return res.status(500).send({ message: "Erro interno" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error.message });
  }
};

exports.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const service = await Services.findOne({ _id: id });

    if (service) {
      console.log(service);
      return res.status(200).send(service);
    }
    return res.status(500).send({ message: "Falha" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
};

exports.getService = async (req, res, next) => {
  // const horarios = ['11:30', '13:00', '15:30', '17:00', '19:25']
  try {
    console.log(req.params.id);
    const services = await Services.find({ "est.id": req.params.id });
    return res.status(201).send(services);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: message });
  }
};

exports.UpdateService = async (req, res, next) => {
  try {
    const { name, est, preco, hours } = req.body;

    const services = new Services({
      name,
      est,
      preco,
      horarios: hours,
    });

    const response = await Services.create(services);
    if (response)
      return res.status(201).send({ message: "Serviço criado com sucesso." });

    return res.status(500).send({ message: "Erro interno" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error.message });
  }
};

exports.DeleteService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const serviceExists = await Services.findOne({ _id: id });
    if (!serviceExists) {
      return res.status(404).send({ message: "not found" });
    }
    await Services.deleteOne({ _id: id });
    return res.status(200).send({ status: 200, message: "serviço apagado" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointments.findOne({
      "service.id": req.params.id,
    });
    console.log(appointments);
    if (appointments) return res.status(200).send(appointments);
    return res.status(404).send({ message: "Sem agendamentos" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Houve um erro" });
  }
};
