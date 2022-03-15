const express = require('express')
const router = express.Router()
const appointments = require('../controllers/appointments')

router.post('/post', appointments.post)
router.get('/:id', appointments.get)
router.get('/service/:id',appointments.getByServiceId)

module.exports= router
