const mongoose = require("mongoose");
const { findOne } = require("../models/Est");
const Est = require("../models/Est");
const Rates = require("../models/Rates");
const Services = require("../models/Services");
//Provisorio

const Ratting = async (estRating, estId, rate) => {
  const peopleRate = await Rates.find({ estId }).count();
  console.log(peopleRate);
  const rating = estRating + rate;
  const ratingmedia = rating / peopleRate;
  console.log(ratingmedia);
  let est = await Est.findOne({ _id: estId });
  est.rating = rating;
  est.ratingmedia = ratingmedia;
  est.save();
};

exports.est = async (req, res, next) => {
  /*   var name = "Barbearia Ruben e filhos";
  var address = "camama, depois do colegio mundo novo";
  var nif = 5473757473;
  var number1 = 965683433;
  var number2 = 963939393;
  var categoryid = "620a2a852a23e32b510ef24c";
  var categoryname = "Barbearia";
  var userid = "574873de9fu";
  var username = "Ruben Mambo";
  var description =
    "somos um bom estabelecimento para voccê cortar o seu cabelo com calma qualidade e tranquilidade e temos preços baixos";
 */
  try {
    let phones_number = [];
    let img = req.file.path;
    const newpath = img.split(["\\"]);
    img = newpath[0] + "/" + newpath[1];
    console.log(img);
    const {
      name,
      address,
      nif,
      number1,
      number2,
      categoryid,
      categoryname,
      userid,
      username,
      description,
    } = req.body;
    phones_number[0] = number1;

    phones_number[1] = number2;

    const category = {
      _id: categoryid,
      name: categoryname,
    };
    const user = {
      _id: userid,
      name: username,
    };
    const est = new Est({
      name,
      img: img,
      nif: nif,
      phones_number: phones_number,
      description: description,
      address: address,
      category: category,
      user: user,
    });
    const request = await Est.create(est);
    return res.status(201).send(est).end();
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const est = await Est.find({ status: "Active" }).sort({ ratingmedia: -1 });
    console.log(typeof est);
    let rates = [];
    let maior = [];
    for (let i = 0; i <= est.length - 1; i++) {
      if (rates.length != 50) {
        rates.push(est[i]);
      }
    }
    console.log(rates.length);

    return res.status(200).send({ rates, est });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.estTopRates = async (req, res, next) => {
  try {
    return res.status(200).send(true);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.addOpen = async (req, res, next) => {
  try {
    const id = req.params.id;
    const open = {
      dia: 2,
      open: "08:30",
      close: "19:30",
    };
    let est = await Est.findOne({ _id: id });
    if (!est) {
      return res.status(404).send({ message: "est not found" });
    }
    est.open_to.push(open);
    await Est.updateOne({ _id: id }, est);
    return res.status(200).send(est);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.get = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const est = await Est.find();
    console.log(est);
    const lowerbusca = categoryId.toLowerCase();
    const filtro = est.filter(
      (est) => est.category._id.toLowerCase() == lowerbusca
    );
    //console.log(filtro);
    const filtro2 = filtro.filter(
      (est) => est.status == "Active"
    );
    return res.status(200).send(filtro2);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.getEstsUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const est = await Est.find();
    const lowerbusca = userId.toLowerCase();
    const filtro = est.filter(
      (est) => est.user._id.toLowerCase() == lowerbusca
    );
    return res.status(201).send(filtro);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.addStar = async (req, res, next) => {
  try {

    const { client, est, rate, comment } = req.body;
    const estExists = await Est.findOne({ _id: est.id })
    if (!estExists) {
      return res.status(404).send({ message: "not found" })
    }
    const rat = {
      client, est, rate, comment
    }
    await Rates.create(rat)
    const r = await Rates.find()
    const lowerbusca = est.id.toLowerCase()
    const filtro = r.filter(
      (r) => r.est.id.toLowerCase() == lowerbusca
    );
    let soma = 0
    console.log(filtro.length)
    console.log(filtro)
    for (let i = 0; i < filtro.length; i++) {
      soma += filtro[i].rate
    }
    console.log(soma)
    const ratingmedia = soma / filtro.length
    console.log(ratingmedia)
    estExists.ratingmedia = ratingmedia
    await Est.updateOne({ _id: est.id }, estExists)
    return res.status(200).send(true);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.getRate = async (req, res, next) => {
  try {
    const { email, id } = req.body;
    const r = await Rates.find()
    const lowerbusca = id.toLowerCase()
    const filtro = r.filter(
      (r) => r.est.id.toLowerCase() == lowerbusca
    );
    const bu = email.toLowerCase()
    const filtro2 = filtro.filter(
      (r) => r.client.email.toLowerCase() == bu
    );

    if (filtro2.length > 0) {
      const toprate = filtro[0]
      if (filtro[1]) {
        toprate.push(filtro[1])
      }
      console.log(toprate)
      return res.status(200).send({ rating: filtro2[0], status: 200, toprate: toprate });
    }
    else {
      return res.status(404).send({ status: 404 });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.ModifyRate = async (req, res, next) => {
  try {
    const { estId, rateId, rate, com } = req.body;

    const estExists = await Est.findOne({ _id: estId })
    if (!estExists) {
      return res.status(404).send({ message: "not found" })
    }
    const rat = await Rates.findOne({ _di: rateId })
    rat.rate = rate
    rat.comment = com
    console.log(rateId)
    await Rates.updateOne({ _id: rateId }, rat)

    const r = await Rates.find()
    const lowerbusca = estId.toLowerCase()
    const filtro = r.filter(
      (r) => r.est.id.toLowerCase() == lowerbusca
    );
    let soma = 0
    for (let i = 0; i < filtro.length; i++) {
      soma += filtro[i].rate
    }
    console.log(soma)
    const ratingmedia = soma / filtro.length
    console.log(ratingmedia)
    return res.status(200).send({ message: "seja feliz" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.getEst = async (req, res, next) => {
  try {
    const est = await Est.findOne({ _id: req.body.id });
    console.log(est);
    return res.status(200).send(est);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.getEstMobile = async (req, res, next) => {
  try {
    const estid = req.params.id;
    //console.group(estid)
    const est = await Est.findOne({ _id: estid });
    const services = await Services.find();
    const lowerbusca = estid.toLowerCase();
    const filtro = services.filter(
      (serv) => serv.est.id.toLowerCase() == lowerbusca
    );
    const rates = await Rates.find();
    const r = rates.filter(
      (ra) => ra.est.id.toLowerCase() == lowerbusca
    );
    const h = []
    const g = []
    if (r.length > 0) {
      h.push(r[0])
      if (r.length > 1) {
        h.push(r[1])
      }
    }
    if (filtro.length > 0) {
      console.log("sim")
      g.push(filtro[0])
      if (filtro.length > 1) {
        g.push(filtro[1])
        if (filtro.length > 2) {
          g.push(filtro[2])
        }
      }
    }
    return res.status(200).send({ est: est, services: filtro, status: 200, rates: r, toprate: h, topserv: g });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    let img = req.file.path;
    const newpath = img.split(["\\"]);
    img = newpath[0] + "/" + newpath[1];
    console.log(img);

    const est = await Est.findOne({ _id: req.params.id });
    if (!est) {
      return res.status(404).send({ message: "est not found" });
    }
    est.images.push(img);
    await Est.updateOne({ _id: req.params.id }, est);
    return res.status(201).send(est);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.updateEst = async (req, res, next) => {
  try {
    console.log(req.body);
    let est = await Est.findOne({ _id: req.params.estId });
    console.log(est);

    if (!est) {
      return res
        .status(404)
        .send({ message: "estabelecimento não encontrado" });
    }
    const phones_number = [];
    /*  let img = req.file.path
    const newpath = img.split(['\\'])
    img = newpath[0] + '/' + newpath[1]
    console.log(img) */

    /////////////////////////////////////////

    //console.log(req.body)

    const {
      name,
      nif,
      categoryId,
      userId,
      phone_number,
      phone_number2,
      description,
      address,
    } = req.body;
    // console.log(name,nif,categoryId,userId,description)

    est.name = name;
    est.nif = nif;
    est.phones_number[0] = phone_number;
    if (phone_number2) {
      est.phones_number[1] = phone_number2;
    }
    est.description = description;
    est.address = address;
    console.log(est);
    //console.log(phones_number)
    //const re = await Est.create(est)
    est.save();

    return res
      .status(201)
      .send({ message: "estabelecimento actualizado com sucesso" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.delete = async (req, res, next) => {
  try {
    console.log(await Est.countDocuments({ _id: req.body.id }));
    let est = await Est.deleteOne({ _id: req.body.id });
    console.log(await Est.countDocuments({ _id: req.body.id }));
    return res
      .status(200)
      .send({ message: "Estabelecimento deletado com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
