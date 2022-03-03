const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const segredo = 'segredo'
const mongoose = require('mongoose')
const User = require('../models/User')


exports.CreateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email: email })
    if (userExists) {
      return res
        .status(422)
        .send({ status: 422, message: 'email ja cadastrado' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: passwordHash
    })
    await user.save()
    return res.status(201).send({
      status: 201,
      message: 'usuario criado com sucesso'
    })
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
    const response = {
      token,
      id: user._id
    }
    return res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ message: 'Falha na autenticação' })
  }
}

exports.Refresh = async (req, res, next) => {
  try {
    const token = req.body.token

    const verify = jwt.verify(token, segredo, (err, user) => {
      console.log(err)
      if (err) return res.status(403).send({message:'token expirado'})
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
