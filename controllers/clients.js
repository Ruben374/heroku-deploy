const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const segredo = 'segredo'
const mongoose = require('mongoose')
const Client = require('../models/Clients')
const nodemailer = require('../config/nodemailer')

exports.SignUpClient = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const clientExists = await User.findOne({ email: email })
    if (clientExists) {
      return res
        .status(422)
        .send({ status: 422, message: 'email ja cadastrado' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    const characters = '0123456789'
    let confirmationCode = ''
    for (let i = 0; i < 4; i++) {
      confirmationCode +=
        characters[Math.floor(Math.random() * characters.length)]
    }

    const client = new Client({
      username,
      email,
      password: passwordHash,
      confirmationCode
    })

    client.save(err => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      res.status(201).send(true)
      nodemailer.sendConfirmationEmail(
        client.username,
        client.email,
        client.confirmationCode
      )
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.VerifyConfirmationCode = async (req, res, next) => {
  try {
    const email = req.body.email
    const confirmationCode = req.body.confirmationCode
    const client = await Client.findOne({
      confirmationCode: confirmationCode,
      email: email
    })
    if (client) {
      //////////////
      client.status = 'Active'
      client.save(err => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }
      })
      const token = jwt.sign(
        {
          id: client._id
        },
        segredo
      )
      const response = {
        token,
        id: client._id
      }
      return res.status(201).send({ response })
    } else {
      return res.status(404).send({ message: 'client not found' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const client = await Client.findOne({ email: email })
    if (!client) {
      return res.status(422).send({ message: 'cliente não encontrado' })
    }
    const checkPassword = await bcrypt.compare(password, client.password)
    if (!checkPassword) {
      return res.status(401).send({ message: 'Falha na autenticação' })
    }
    const token = jwt.sign(
      {
        id: client._id
      },
      segredo
    )
    const response = {
      token,
      id: client._id
    }
    return res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ message: 'Falha na autenticação' })
  }
}

exports.RefreshToken = async (req, res, next) => {
  try {
    const token = req.body.token
    const verify = jwt.verify(token, segredo, (err, client) => {
      console.log(err)
      if (err) return res.status(403).send({ message: 'token expirado' })
      const id = client.id
      const newtoken = jwt.sign(
        {
          id: id
        },
        segredo
      )
      const response = {
        token: newtoken,
        id: id
      }
      return res.status(200).send(response)
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
