const mongoose = require("mongoose");
const { findOne } = require("../models/Est");
const Est = require("../models/Est");
const Services = require("../models/Services");
const Appointments = require("../models/Appointments");
const Rates = require("../models/Rates");

exports.est = async (req, res) => {
  try {
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

    let phones_number = [];
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

    let img = req.file;
    console.log(img);
    if (img) {
      img = img.path;
      const newpath = img.split(["\\"]);
      img = newpath[0] + "/" + newpath[1];

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
      await Est.create(est);
      console.log(est);
      return res.status(201).send(est).end();
    }
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
    const open_to = req.body.open_to;
    /* const open = {
      dia: 0,
      open: "08:30",
      close: "19:30",
    }; */
    let est = await Est.findOne({ _id: id });
    if (!est) {
      return res.status(404).send({ message: "est not found" });
    }
    est.open_to.push(open_to);
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

exports.openClose = async (req, res, next) => {
  try {
    const open = req.body.open;
    console.log(open);
    const est = await Est.findOneAndUpdate(
      { _id: req.body.id },
      { open: !open }
    );
    console.log(est, open);
    if (est)
      return res.status(201).send({
        message: req.body.open
          ? "Estabelecimento fechado com sucesso"
          : "Estabelecimento aberto",
        text: !open,
      });
    return res.status(500).send({ message: "Erro ao atualizar" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.getEstsUser = async (req, res, next) => {
  const estId = req.params.estId;
  console.log(estId);
  try {
    const est = await Est.find();
    const lowerbusca = estId.toLowerCase();
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
    const est = await Est.findOne({ _id: req.params.estId });
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

exports.test = async (req, res, next) => {
  console.log("Teste");
  return res.status(500).send({ message: "Olá mundo" });
};

exports.testAll = async (req, res) => {
  console.log("Olá mundo");
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (req.file) {
      console.log(req.file);
      let img = req.file.path;
      const newpath = img.split(["\\"]);
      img = newpath[0] + "/" + newpath[1];
      const alter = await Est.findOneAndUpdate(
        { _id: req.params.id },
        {
          img: img,
        }
      );
      return res.status(200).send({ message: "Feito" });
    }

    return res.status(404).send({ message: "Imagem não encontrada" });
    /* return res.status(404).send({ message: "Erro ao atualizar" }); */
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ "Erro: ": error });
  }
};

exports.updateEst = async (req, res, next) => {
  try {
    const {
      name,
      address,
      nif,
      number1,
      number2,
      imagesCount,
      categoryid,
      categoryname,
      open_to,
      description,
    } = req.body;

    let phones_number = [];

    phones_number[0] = number1;

    phones_number[1] = number2;

    //Criando uma função semelhante ao hook state do React js
    const useState = (defaultValue) => {
      //Definindo uma variável com o valor do parametro
      let value = defaultValue;

      //Criei uma função para definir o valor com o parâmetro newValue
      const getValue = () => value;

      //Alteramos o valor para newValue
      const setValue = (newValue) => (value = newValue);

      //Retornando um array com o valor e a função
      return [getValue, setValue];
    };

    let est = await Est.findOne({ _id: req.params.estId });

    if (!est) {
      return res
        .status(404)
        .send({ message: "estabelecimento não encontrado" });
    }

    const [estImages, setEstImages] = useState(est.images);
    const [newOpen, setNewOpen] = useState(est.open_to);

    JSON.parse(open_to).map((item) => {
      setNewOpen([...newOpen(), item]);
    });

    const qImg = est.images.length;
    if (imagesCount > 0) {
      for (let i = 0; i < imagesCount; i++) {
        let img = req.files[i]
        if (req.files[i].path) {
          img = req.files[i].path;
          const newpath = img.split(["\\"]);
          img = newpath[0] + "/" + newpath[1];
        }
        setEstImages([...estImages(), { id: qImg + i, img: img }]);
      }
      const update = await Est.findOneAndUpdate(
        { _id: req.params.estId },
        {
          images: estImages(),
        }
      );
    }
    const update = await Est.findOneAndUpdate(
      { _id: req.params.estId },
      {
        name: name,
        address: address,
        number1: number1,
        number2: number2,
        nif: nif,
        open_to: newOpen(),
        categoryid: categoryid,
        categoryname: categoryname,
        description: description,
      }
    );

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
    await Est.deleteOne({ _id: req.params.estId });
    await Services.deleteOne({ "est.id": req.params.estId });
    await Appointments.deleteOne({ "service.est.id": req.params.estId });
    return res
      .status(200)
      .send({ message: "Estabelecimento deletado com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
