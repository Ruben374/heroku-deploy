const mongoose = require('mongoose')
const Est = require('../models/Est')
const Rates = require('../models/Rates')
//Provisorio
const accession_date = '19/02/2022'
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

  let img = req.file.path
  const newpath = img.split(['\\'])
  img = newpath[0] + '/' + newpath[1]
  //console.log(img)

  /////////////////////////////////////////
  const open_to = [
  
    { dia: 1, open: '08:00', close: '21:00' },
    { dia: 2, open: '08:00', close: '21:00' },
    { dia: 3, open: '08:00', close: '21:00' },
    { dia: 4, open: '08:00', close: '21:00' },
    { dia: 5, open: '08:00', close: '21:00' },
   
  ]
  const address = { bairro: 'Benfica', rua: 2 }
  const phone_number = ['954678098', '943678951']
  //console.log(req.body)
  try {
    const { name, nif, categoryId, userId } = req.body
    const est = {
      categoryId,
      name,
      nif,
      img,
      accession_date,
      phone_number,
      open_to,
      address,
      userId
    }

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
