const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const segredo = 'segredo'
const mongoose = require('mongoose')
const User = require('../models/Users')
const nodemailer = require('../config/nodemailer')

exports.SignUpUser = async (req, res, next) => {
  try {
    const characters = '0123456789'
    let confirmationCode = ''
    const { username, email, password } = req.body
    if (!username || !password || !email) {
      return res.status(401).send({ message: 'expected field' })
    }
    let userExists = await User.findOne({ email: email })
    if (userExists && userExists.status == 'Active') {
      return res
        .status(422)
        .send({ status: 422, message: 'email ja cadastrado' })
    }
    if (userExists && userExists.status == 'Pending') {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
 
      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)]
      }
      userExists.password= passwordHash
      userExists.confirmationCode = confirmationCode
      userExists.username=username
      //console.log(userExists)

      userExists.save(err => {
        if (err) {
          return res.status(500).send({ status: 500, message: err })
        }
        nodemailer.sendConfirmationEmail(
          userExists.username,
          userExists.email,
          userExists.confirmationCode
        )
        return res
          .status(302)
          .send({ status: 302, message: 'codigo reenviado com sucesso' })
      })
    }
    if (!userExists) {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      for (let i = 0; i < 4; i++) {
        confirmationCode +=
          characters[Math.floor(Math.random() * characters.length)]
      }

      const user = new User({
        username,
        email,
        password: passwordHash,
        confirmationCode
      })

      user.save(err => {
        if (err) {
          res.status(500).send({ status: 500, message: err })
          return
        }
        res.status(201).send({
          status: 201,
          message: 'conta criada com sucesso o seu email'
        })
        nodemailer.sendConfirmationEmail(
          user.username,
          user.email,
          user.confirmationCode
        )
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ status: 500, error: error })
  }
}

exports.VerifyConfirmationCode = async (req, res, next) => {
  try {
    const email = req.body.email
    const confirmationCode = req.body.code
    console.log(req.body)
    const user = await User.findOne({
      confirmationCode: confirmationCode,
      email: email
    })
    if (user) {
      //////////////
      user.status = 'Active'
      user.save(err => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }
      })
      const token = jwt.sign(
        {
          id: user._id
        },
        segredo
      )
      const data = {
        token,
        user: user
      }
      return res.status(200).send(data)
    } else { 
      return res.status(404).send({message: 'user not found'})
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({error: error})
  }
}

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res
        .status(404)
        .send({ status: 404, message: 'usuario não encontrado' })
    }
    if (user.status == 'Pending') {
      return res
        .status(422)
        .send({ status: 422, message: 'Falha na autenticação' })
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res
        .status(422)
        .send({ status: 422, message: 'Falha na autenticação' })
    }
    const token = jwt.sign(
      {
        id: user._id
      },
      segredo
    )
    const data = {
      token,
      user: user
    }
    return res.status(200).send(data)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ status: 500, error: error })
  }
}

exports.RefreshToken = async (req, res, next) => {
  try {
    const token = req.body.token
    let id = ''
    const verify = jwt.verify(token, segredo, (err, user) => {
      if (err) return res.status(403).send({ message: 'token expirado' })
      id = user.id
    })
    // console.log(err)
    const data = await User.findOne({ _id: id })
    const newtoken = jwt.sign(
      {
        id: id
      },
      segredo
    )
    const response = {
      token: newtoken,
      dataUser: data
    }
    //console.log(response)
    return res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
