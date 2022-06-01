const mongoose = require('mongoose')
const Category = require('../models/Category')

exports.postCategory = async (req, res, next) => {
  try {
    const name = req.body.name
    /////////////////////////////////////////
    let path = req.file.path
    const newpath = path.split(['\\'])
    path = newpath[0] + '/' + newpath[1]
    /////////////////////////////////////////
    const category = new Category({
      name,
      image:path,     
    })
    await category.save()
    return res.status(201).send({ message: 'categoria criada com sucesso' })

    return res.status(201).send({ message: 'ola mundo' })
  } catch (error) {
      console.log(error.message)
    return res.status(500).send({ error: error })
  }
}
exports.getCategory = async (req, res, next) => {
  try {

   const categories= await Category.find() 
      console.log(categories.length)
      return res.status(201).send(categories)
  } catch (error) {
      console.log(error.message)
    return res.status(500).send({ error: error })
  }
}

