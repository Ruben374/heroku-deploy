const express = require('express')
const router = express.Router()
const appointments = require('../controllers/appointments')

router.post('/post', appointments.post)
router.get('/:email', appointments.get)
router.get('/service/:id',appointments.getByServiceId)
router.get('/services/:id/:date',appointments.getByServiceIdAndDate)
router.delete('/delete',appointments.DaleteAppointment)

module.exports= router
