const mongoose = require("mongoose");
const Appointments = require("../models/Appointments");
const Services = require("../models/Services");
const User = require("../models/Clients");
const Est = require("../models/Est");
const Clients = require("../models/Clients");
exports.post = async (req, res, next) => {
  try {
    const { est, client, service, date } = req.body;
    const appointments = new Appointments({
      est: est,
      client: client,
      service: service,
      date: date,
    });

    const c = Clients.findOne({ email: client.email });
    c.appointments.push(appointments);
    await Clients.updateOne({ email: client.email }, c);
    const re = await Appointments.create(appointments);
    return res.status(200).send({ message: "serviço agendando com sucesso" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.get = async (req, res, next) => {
  try {
    const clientid = req.params.id;
    const c = "f";
    const agendamentos = await Appointments.find({ client: clientid });
    return res.status(201).send(agendamentos);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.getByServiceId = async (req, res, next) => {
  try {
    const serviceid = req.params.id;
    const agendamentos = await Appointments.find({ serviceid: serviceid });
    return res.status(201).send(agendamentos);
  } catch (error) {
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
