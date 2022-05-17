const mongoose = require("mongoose");
const Est = require("../models/Est");
const Rates = require("../models/Rates");
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
    const est = await Est.find().sort({ ratingmedia: -1 });
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
      dia: 0,
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
    const lowerbusca = categoryId.toLowerCase();
    const filtro = est.filter(
      (est) => est.category._id.toLowerCase() == lowerbusca
    );
    console.log(filtro);
    return res.status(201).send(filtro);
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
    //let est = await Est.find({ _id: req.body.id})
    const { clientId, estId, rate } = req.body;

    const rates = new Rates({
      clientId,
      estId,
      rate,
    });
    rates.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
    console.log(req.body);
    const estRate = await Est.findOne({ _id: estId });
    console.log(estRate);

    Ratting(estRate.rating, estId, rate);
    return res.status(200).send({ message: "bm vindo" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.getRate = async (req, res, next) => {
  try {
    const { estId, clientId } = req.body;
    const rate = await Rates.findOne({ clientId, estId });
    if (!rate) {
      return res.status(404).send({ message: "not fount", status: 404 });
    }
    console.log(rate);
    return res.status(200).send({ rating: rate.rate, status: 200 });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.ModifyRate = async (req, res, next) => {
  try {
    const { estId, clientId, rate } = req.body;
    let est = await Est.findOne({ _id: estId });
    let rat = await Rates.findOne({ estId, clientId });
    const h = rat.rate;
    rat.rate = rate;
    rat.save();
    const peopleRate = await Rates.find({ estId }).count();
    let soma = est.rating - h;
    console.log(soma);
    soma = soma + rate;
    const media = soma / peopleRate;
    est.rating = soma;
    est.ratingmedia = media;
    est.save();
    return res.status(200).send({ message: "seja feliz" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
 
exports.getEst = async (req, res, next) => {
  try {
    const est = await Est.findOne({ _id: req.body.id });
    return res.status(200).send(est);
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
    await Est.deleteOne({ _id: req.body.id });
    return res.status(200).send({ message: "Estabelecimento deletado com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
