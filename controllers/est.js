const mongoose = require('mongoose')
const Est = require('../models/Est')
//Provisorio
const accession_date = '19/02/2022'
const ObjectId = require('mongodb').ObjectId

exports.est = async (req, res, next) => {
  /////////////////////////////////////////
 //console.log(req.body.name)

  let img = req.file.path
  const newpath = img.split(['\\'])
  img = newpath[0] + '/' + newpath[1]
 console.log(img)

  /////////////////////////////////////////
  //const open_to = {segunda: true,terça: false, quarta: true, quinta: false, sexta: true, sabado: true, domingo: false}
  //const address = {bairro: 'camama',rua: 34}

  //const phone_number = ['948097837', '222367948']

console.log(req.body)


  try {
    const { name,nif,categoryId,userId,address,phone_number,open_to } = req.body
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
