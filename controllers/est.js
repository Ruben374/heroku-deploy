const mongoose = require('mongoose')
const Est = require('../models/Est')
const Rates = require('../models/Rates')
//Provisorio
const accession_date = '26/04/2022'
const Ratting = async (estRating, estId, rate) => {
  const peopleRate = await Rates.find({ estId }).count()
  console.log(peopleRate)
  const rating = estRating + rate
  const ratingmedia = rating / peopleRate
  console.log(ratingmedia)
  let est = await Est.findOne({ _id: estId })
  est.rating = rating
  est.ratingmedia = ratingmedia
  est.save()
}

exports.est = async (req, res, next) => {
  /////////////////////////////////////////
  //console.log(req.body.name)
  const phones_number = []

  let img = req.file.path
  const newpath = img.split(['\\'])
  img = newpath[0] + '/' + newpath[1]
  console.log(img)

  /////////////////////////////////////////
  const open_to = [
    { dia: 1, open: '08:00', close: '21:00' },
    { dia: 2, open: '08:00', close: '21:00' },
    { dia: 3, open: '08:00', close: '21:00' },
    { dia: 4, open: '08:00', close: '21:00' },
    { dia: 5, open: '08:00', close: '21:00' }
  ]

  console.log(req.body.name)
  console.log(req.body.address)
  console.log(req.body)
  try {
    const {
      name,
      nif,
      categoryId,
      userId,
      number1,
      number2,
      description,
      address
    } = req.body
    // console.log(name,nif,categoryId,userId,description)
    phones_number[0] = number1
    if (number2) {
      phones_number[1] = number2
    }
    const est = {
      categoryId,
      name,
      nif,
      img,
      accession_date,
      phones_number,
      description,
      address,
      userId
    }

    //console.log(phones_number)
    const re = await Est.create(est)

    return res
      .status(201)
      .send({ message: 'estabelecimento criado com sucesso' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}

exports.get = async (req, res, next) => {
  const categoryId = req.params.categoryId
  try {
    const g = await Est.find({ categoryId })
    console.log(g.length)
    return res.status(201).send(g)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.getEstsUser = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const response = await Est.find({ userId })
    return res.status(201).send(response)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.addStar = async (req, res, next) => {
  try {
    //let est = await Est.find({ _id: req.body.id})
    const { clientId, estId, rate } = req.body

    const rates = new Rates({
      clientId,
      estId,
      rate
    })
    rates.save(err => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
    })
    console.log(req.body)
    const estRate = await Est.findOne({ _id: estId })
    console.log(estRate)

    Ratting(estRate.rating, estId, rate)
    return res.status(200).send({ message: 'bm vindo' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.getRate = async (req, res, next) => {
  try {
    const { estId, clientId } = req.body
    const rate = await Rates.findOne({ clientId, estId })
    if (!rate) {
      return res.status(404).send({ message: 'not fount', status: 404 })
    }
    console.log(rate)
    return res.status(200).send({ rating: rate.rate, status: 200 })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.ModifyRate = async (req, res, next) => {
  try {
    const { estId, clientId, rate } = req.body
    let est = await Est.findOne({ _id: estId })
    let rat = await Rates.findOne({ estId, clientId })
    const h = rat.rate
    rat.rate = rate
    rat.save()
    const peopleRate = await Rates.find({ estId }).count()
    let soma = est.rating - h
    console.log(soma)
    soma = soma + rate
    const media = soma / peopleRate
    est.rating = soma
    est.ratingmedia = media
    est.save()
    return res.status(200).send({ message: 'seja feliz' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.getEst = async (req, res, next) => {
  try {
    const est = await Est.findOne({ _id: req.params.id })
    return res.status(200).send(est)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.updateEst = async (req, res, next) => {
  try {
    console.log(req.body)
    let est = await Est.findOne({ _id: req.params.estId })
    console.log(est)

    if (!est) {
      return res.status(404).send({ message: 'estabelecimento não encontrado' })
    }
    const phones_number = []
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
      address
    } = req.body
    // console.log(name,nif,categoryId,userId,description)

    est.name = name
    est.nif = nif
    est.phones_number[0] = phone_number
    if (phone_number2) {
      est.phones_number[1] = phone_number2
    }
    est.description = description
    est.address = address
    console.log(est)
    //console.log(phones_number)
    //const re = await Est.create(est)
    est.save()

    return res
      .status(201)
      .send({ message: 'estabelecimento actualizado com sucesso' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

exports.apaga = async (req, res, next) => {
  try {
    let est = await Est.findOne({ _id: req.body.id })
    console.log(est)
    est.open_to.push({ dia: 3, open: '08:00', close: '21:00' })
    est.save()
    return res.status(200).send({ message: 'ok' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
