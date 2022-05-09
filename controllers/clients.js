const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const segredo = "segredo";
const mongoose = require("mongoose");
const Client = require("../models/Clients");
const nodemailer = require("../config/nodemailer");
const remImg = require("../remImg.js");

exports.SignUpClient = async (req, res, next) => {
  const characters = "0123456789";
  let confirmationCode = "";
  try {
    const { username, email, password } = req.body;
    const clientExists = await Client.findOne({ email: email });
    if (clientExists && clientExists.status == "Active") {
      return res
        .status(422)
        .send({ status: 422, message: "email ja cadastrado" });
    }
    if (clientExists && clientExists.status == "Pending") {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)];
      }
      clientExists.password = passwordHash;
      clientExists.confirmationCode = confirmationCode;
      clientExists.username = username;
      //console.log(userExists)

      clientExists.save((err) => {
        if (err) {
          return res.status(500).send({ status: 500, message: err });
        }
        nodemailer.sendConfirmationEmail(
          clientExists.username,
          clientExists.email,
          clientExists.confirmationCode
        );
        return res
          .status(302)
          .send({ status: 302, message: "codigo reenviado com sucesso" });
      });
    }
    if (!clientExists) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)];
      }

      const client = new Client({
        username,
        email,
        password: passwordHash,
        confirmationCode,
      });

      client.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).send({ message: "Success", status: 201 });
        nodemailer.sendConfirmationEmail(
          client.username,
          client.email,
          client.confirmationCode
        );
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.VerifyConfirmationCode = async (req, res, next) => {
  try {
    const email = req.body.email;
    const confirmationCode = req.body.confirmationCode;
    const client = await Client.findOne({
      confirmationCode: confirmationCode,
      email: email,
    });
    if (client) {
      //////////////
      client.status = "Active";
      client.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
      const token = jwt.sign(
        {
          id: client._id,
        },
        segredo
      );
      const response = {
        token,
        email: client.email,
        name: client.username,
        avatar: client.avatar,
        status: 201,
      };
      return res.status(201).send(response);
    } else {
      return res.status(404).send({ message: "client not found", status: 404 });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email: email });
    if (!client) {
      return res
        .status(422)
        .send({ message: "cliente não encontrado", status: 404 });
    }
    const checkPassword = await bcrypt.compare(password, client.password);
    if (!checkPassword) {
      return res
        .status(401)
        .send({ message: "Falha na autenticação", status: 401 });
    }
    const token = jwt.sign(
      {
        id: client._id,
      },
      segredo
    );
    const response = {
      token,
      email: client.email,
      name: client.username,
      avatar: client.avatar,
      status: 200,
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: "Falha na autenticação", status: 404 });
  }
};

exports.RefreshToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    let id = "";
    const verify = jwt.verify(token, segredo, (err, client) => {
      if (err)
        return res.status(403).send({ message: "token expirado", status: 403 });
      id = client.id;
    });
    // console.log(err)
    const data = await Client.findOne(
      { _id: id },
      { password: 0, confirmationCode: 0, resetPasswordCode: 0, id: 0 }
    );
    console.log(data);
    const newtoken = jwt.sign(
      {
        id: id,
      },
      segredo
    );
    const response = {
      token: newtoken,
      email: data.email,
      name: data.username,
      avatar: data.avatar,
      status:200
    };
    console.log(response);
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.UploadImage = async (req, res, next) => {
  try {
    console.log(req.body);
    ///////////////////////////////////
    let img = req.file.path;
    const newpath = img.split(["\\"]);
    img = newpath[0] + "/" + newpath[1];
    console.log(img);
    //////////////////////////////////////////
    const client = await Client.findOne({ email: req.body.email });
    remImg(client.avatar);
    client.avatar = img;
    client.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
    res.send({ congrats: "data recieved" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error");
  }
};
exports.UpdateClient = async (req, res, next) => {
  const option = req.body.option;

  try {
    switch (option) {
      case "Password":
        let client = await Client.findOne({ email: req.body.email });
        const checkPassword = await bcrypt.compare(
          req.body.current,
          client.password
        );
        if (!checkPassword) {
          return res.status(401).send({ message: "Password Incorreta" });
        }
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(req.body.param, salt);
        client.password = passwordHash;
        client.save();
        return res.status(200).send({ message: "Success" });
        break;
      case "Name":
        console.log(req.body.email);
        let clie = await Client.findOne({ email: req.body.email });
        console.log(clie);
        clie.username = req.body.param;
        clie.save();
        return res.status(200).send({ status: 200, message: "Success" });
        break;
      case "Ps":
        console.log(req.body.param);
        let c = await Client.findOne({ email: req.body.email });
        console.log(c);
        if (!c) {
          return res.status(422).send({ status: 422, message: "Error" });
        }
        const s = await bcrypt.genSalt(12);
        const ph = await bcrypt.hash(req.body.param, s);
        c.password = ph;
        c.save();
        return res
          .status(200)
          .send({ status: 200, message: "Senha redefinida com sucesso" });
        break;

      default:
        return res.status(200).send({ status: 422, message: "ola mundo" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const client = await Client.findOne({ email: email });
    if (!client) {
      return res
        .status(404)
        .send({ status: 404, message: "usuario não encontrado" });
    }
    const characters = "0123456789";
    let resetPasswordCode = "";
    for (let i = 0; i < 4; i++) {
      resetPasswordCode +=
        characters[Math.floor(Math.random() * characters.length)];
    }

    console.log(client);
    client.resetPasswordCode = resetPasswordCode;

    client.save((err) => {
      if (err) {
        res.status(500).send({ status: 500, message: err });
        return;
      }
      res
        .status(200)
        .send({ status: 200, message: "Email enviado com sucesso" });
      nodemailer.sendConfirmationEmail(
        client.username,
        client.email,
        client.resetPasswordCode
      );
    });
    //return res.status(200).send({ message: 'ola mundo' })
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: 500, error: error });
  }
};
exports.VerifyResetPasswordCode = async (req, res, next) => {
  try {
    const { email, resetPasswordCode } = req.body;
    const client = await Client.findOne({
      resetPasswordCode: resetPasswordCode,
      email: email,
    });
    if (client) {
      return res.status(200).send({ status: 200, message: "codigo valido" });
    } else {
      return res.status(422).send({ status: 422, message: "Codigo invalido" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: 500, error: error });
  }
};
