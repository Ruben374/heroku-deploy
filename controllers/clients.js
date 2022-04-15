const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const segredo = 'segredo'
const mongoose = require('mongoose')
const Client = require('../models/Clients')
const nodemailer = require('../config/nodemailer')
const remImg = require('../remImg.js')

exports.SignUpClient = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const clientExists = await Client.findOne({ email: email })
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
        id: client._id,
        name: client.username,
        avatar: client.avatar
      }
      return res.status(201).send(response)
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
      id: client._id,
      name: client.username,
      avatar: client.avatar
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
    let id = ''
    const verify = jwt.verify(token, segredo, (err, client) => {
      if (err) return res.status(403).send({ message: 'token expirado' })
      id = client.id
    })
    // console.log(err)
    const data = await Client.find({ _id: id })
    const newtoken = jwt.sign(
      {
        id: id
      },
      segredo
    )
    const response = {
      token: newtoken,
      id: id,
      name: data[0].username,
      avatar: data[0].avatar
    }
    console.log(response)
    return res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.UploadImage = async (req, res, next) => {
  try {
    console.log(req.body)
    ///////////////////////////////////
    let img = req.file.path
    const newpath = img.split(['\\'])
    img = newpath[0] + '/' + newpath[1]
    console.log(img)
    //////////////////////////////////////////
    const client = await Client.findOne({ _id: req.body.id })
    remImg(client.avatar)
    client.avatar = img
    client.save(err => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
    })
    res.send({ congrats: 'data recieved' })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Error')
  }
}
exports.UpdateClient = async (req, res, next) => {
  const option = req.body.option

  try {
    switch (option) {
      case 'Password':
        let client = await Client.findOne({ _id: req.body.id })
        const checkPassword = await bcrypt.compare(
          req.body.current,
          client.password
        )
        if (!checkPassword) {
          return res.status(401).send({ message: 'Password Incorreta' })
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(req.body.param, salt)
        client.password = passwordHash
        client.save()
        return res.status(200).send({ message: 'Success' })
        break
      case 'Name':
        let clie = await Client.findOne({ _id: req.body.id })
        clie.username = req.body.param
        clie.save()
        return res.status(200).send({ message: 'Success' })
        break
      case 'Ps':
       console.log(req.body.param)
        let c = await Client.findOne({ email: req.body.id })
        console.log(c)
        if (!c) {
          return res.status(422).send({ message: 'Error' })
        }
        const s = await bcrypt.genSalt(12)
        const ph = await bcrypt.hash(req.body.param, s)
        c.password = ph
        c.save()
        return res.status(200).send(true)
        break

      default:
        return res.status(200).send({ message: 'ola mundo' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const client = await Client.findOne({ email: email })
    if (!client) {
      return res
        .status(404)
        .send({ status: 404, message: 'usuario não encontrado' })
    }
    const characters = '0123456789'
    let resetPasswordCode = ''
    for (let i = 0; i < 4; i++) {
      resetPasswordCode +=
        characters[Math.floor(Math.random() * characters.length)]
    }

    console.log(client)
    client.resetPasswordCode = resetPasswordCode

    client.save(err => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      res.status(201).send(true)
      nodemailer.sendConfirmationEmail(
        client.username,
        client.email,
        client.resetPasswordCode
      )
    })
    //return res.status(200).send({ message: 'ola mundo' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.VerifyResetPasswordCode = async (req, res, next) => {
  try {
    const { email, resetPasswordCode } = req.body
    const client = await Client.findOne({
      resetPasswordCode: resetPasswordCode,
      email: email
    })
    if (client) {
      return res.status(201).send(true)
    } else {
      return res.status(422).send({ message: 'Codigo invalido' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
