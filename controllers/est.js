const mongoose = require("mongoose");
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
    console.log(filtro);
    return res.status(201).send(filtro);
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
    const est = await Est.findOne({ _id: req.params.estId });
    return res.status(200).send(est);
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
