const express= require('express')
const router= express.Router();
const services = require('../controllers/services')

router.post('/post',services.post)
router.get('/:id',services.get)

module.exports= router