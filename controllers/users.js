const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const segredo = "segredo";
const mongoose = require("mongoose");
const Users = require("../models/Users");
const Est = require("../models/Est");
const nodemailer = require("../config/nodemailer");

exports.SignUpUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(401).send({ message: "expected field" });
    }

    const userExist = await Users.findOne({ email });

    if (!userExist) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      const characters = "0123456789";
      let confirmationCode = "";
      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)];
      }
      const confirmCode = Number(confirmationCode);

      const user = new Users({
        username,
        email,
        password: passwordHash,
        confirmCode,
      });

      user.save((err) => {
        res.status(201).send(true);
        nodemailer.sendConfirmationEmail(
          user.username,
          user.email,
          confirmCode
        );
      });
    } else if (userExist.status === "Active") {
      return res
        .status(422)
        .send({ status: 422, message: "Email já cadastrado!" });
    } else {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      const characters = "0123456789";
      let confirmationCode = "";
      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)];
      }
      const confirmCode = Number(confirmationCode);
      const user = await Users.findOneAndUpdate(
        { email },
        { confirmCode: confirmCode, password: passwordHash }
      );
      nodemailer.sendConfirmationEmail(user.username, email, confirmCode);
      res.status(200).send({ message: "Email cadastrado com sucesso" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};

exports.VerifyConfirmationCode = async (req, res, next) => {
  try {
    const { email, confirmationCode } = req.body;
    console.log(email, confirmationCode);
    const userExist = await Users.findOneAndUpdate(
      { email, confirmCode: confirmationCode },
      { status: "Active" }
    );

    if (userExist) {
      const token = jwt.sign(
        {
          id: userExist._id,
        },
        segredo
      );
      const data = {
        token,
        user: userExist,
      };
      return res
        .status(201)
        .send({ data, message: "Conta activada com sucesso" });
    } else {
      res.status(404).send({ message: "Código errado, tente novamente" });
    }
    console.log(userExist);
  } catch (error) {
    res.status(500).send({ message: "Falha ao ativar a conta" });
  }
};

exports.VerifyEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = Users.findOne({ email, status: "Active" });
    if (user) res.status(200).send(user);
    else res.status(404).send({ message: "Usuário não encontrado!" });
  } catch (error) {
    res.status(500).send({ message: "Falha na autenticação" });
  }
};

exports.VerifyReconConfirmationCode = async (req, res) => {
  try {
    const { email, confirmationCodeReset } = req.body;
    const userExist = await Users.findOneAndUpdate(
      { email, confirmCode: confirmationCodeReset },
      { status: "Active" }
    );
    console.log(userExist);
    if (userExist) {
      return res.status(201).send({ message: "Código verificado!" });
    } else {
      res.status(404).send({ message: "Código errado, tente novamente" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

exports.confirmcodereset = async (req, res, next) => {
  try {
    const email = req.body.email;
    const characters = "0123456789";
    let confirmationCode = "";
    for (let i = 0; i < 4; i++) {
      confirmationCode +=
        characters[Math.floor(Math.random() * characters.length)];
    }
    const confirmCode = Number(confirmationCode);
    const user = await Users.findOneAndUpdate(
      { email },
      { confirmCode: confirmCode }
    );
    nodemailer.sendConfirmationEmail(user.username, email, confirmCode);
    res.status(200).send({ message: "Código reenviado com sucesso" });
  } catch (error) {
    res.status(500).send({ message: "Falha ao reenviar código" });
  }
};

exports.resertPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);
    if (!email || !newPassword)
      res.status(500).send({ message: "Falta campos" });
    else {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      const user = await Users.findOneAndUpdate(
        { email },
        { password: passwordHash }
      );
      console.log(user);
      if (user) {
        const token = jwt.sign(
          {
            id: user._id,
          },
          segredo
        );
        res
          .status(200)
          .send({ user, token, message: "Palavra passe alterada com sucesso" });
      } else
        res.status(500).send({ message: "Falha ao atualizar a palavra passe" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Falha interna, tente novamente" });
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(422).send({ message: "Usuario não encontrado" });
    }
    if (user.status === "Pending") {
      return res.status(422).send({ message: "Falha na autenticação" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).send({ message: "Falha na autenticação" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      segredo
    );
    const data = {
      token,
      data: user,
    };
    return res.status(200).send(data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Falha na autenticação" });
  }
};

exports.RefreshToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    let id = "";
    const verify = jwt.verify(token, segredo, (err, user) => {
      if (err) return res.status(403).send({ message: "token expirado" });
      id = user.id;
    });
    // console.log(err)
    const data = await Users.findOne({ _id: id });
    const newToken = jwt.sign(
      {
        id: id,
      },
      segredo
    );
    const response = {
      token: newToken,
      user: data,
    };
    //  console.log(response)
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error });
  }
};
exports.get = async (req, res, next) => {
  const userId = req.params.id;
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
