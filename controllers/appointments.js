const mongoose = require("mongoose");
const Appointments = require("../models/Appointments");
const Services = require("../models/Services");
const User = require("../models/Clients");
const Est = require("../models/Est");
const Clients = require("../models/Clients");
exports.post = async (req, res, next) => {
  try {
    const { client, service, date } = req.body;
    const appointments = new Appointments({
      client: client,
      service: service,
      date: date,
    });
    const re = await Appointments.create(appointments);

    return res.status(201).send({ status: 201, appointment: appointments });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.get = async (req, res, next) => {
  try {
    const email = req.params.email
    const agendamentos = await Appointments.find();
    const lowerbusca = email.toLowerCase();
    const filtro = agendamentos.filter(
      (age) => age.client.email.toLowerCase() == lowerbusca
    );
    return res.status(200).send({ status: 200, agendamentos: filtro });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.getByServiceId = async (req, res, next) => {
  try {
    const serviceid = req.params.id;
    const agendamentos = await Appointments.find();
    console.log(agendamentos)
    const lowerbusca = serviceid.toLowerCase();
    const filtro = agendamentos.filter(
      (age) => age.service.id.toLowerCase() == lowerbusca
    );
    return res.status(200).send({ status: 200, agendamentos: filtro });
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error });
  }
};

exports.getByServiceIdAndDate = async (req, res, next) => {
  try {
    const serviceid = req.params.id;
    const date = req.params.date;
    console.log(date);

    const agendamentos = await Appointments.find({ serviceid: serviceid });
    var vet = [];
    const filtro = agendamentos.filter((list) => list.date == date);
    console.log(filtro);
    for (let i = 0; i < filtro.length; i++) {
      //console.log(filtro[i].hour)
      vet.push(filtro[i].hour);
    }

    return res.status(201).send({ data: vet });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const id = req.body.id;
    const date = req.body.date;
    const appointments = await Appointments.findOne({ _id: id });
    appointments.date = date;
    await Appointments.updateOne({ _id: id }, appointments);
    return res.status(200).send({ status: 200, appointment: appointments });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
exports.DaleteAppointment = async (req, res, next) => {
  try {
    const id = req.body.id;
    const appointments = await Appointments.deleteOne({ _id: id });
    await Appointments.updateOne({ _id: id }, appointments);
    return res.status(200).send({ status: 200, appointment: appointments });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
