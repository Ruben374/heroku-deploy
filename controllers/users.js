const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const segredo = 'segredo'
const mongoose = require('mongoose')
const User = require('../models/Users')
const nodemailer = require('../config/nodemailer')

exports.SignUpUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    if(!username || !password || !email){
      return res.status(401).send({ message: 'expected field'})
    }
    const userExists = await User.findOne({ email: email })
    if (userExists) {
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

    const user = new User({
      username,
      email,
      password: passwordHash,
      confirmationCode
    })

    user.save(err => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      res.status(201).send(true)
      nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
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
      return res.status(201).send({ data:data })
    } else {
      return res.status(404).send({ message: 'user not found' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(422).send({ message: 'usuario não encontrado' })
    }
    if(user.status=='pending'){
      return res.status(422).send({message:'Falha na autenticação'})
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(401).send({ message: 'Falha na autenticação' })
    }
    const token = jwt.sign(
      {
        id: user._id
      },
      segredo
    )
    const data = {
      token,
      data: user
    }
    return res.status(200).send({data:data})
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ message: 'Falha na autenticação' })
  }
}

exports.RefreshToken = async (req, res, next) => {
  try {
    const token = req.body.token
    const verify = jwt.verify(token, segredo, (err, user) => {
      console.log(err)
      if (err) return res.status(403).send({ message: 'token expirado' })
      const id = user.id
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
