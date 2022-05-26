const express = require('express')
const router = express.Router();
const services = require('../controllers/services')

router.post('/post', services.post)
router.get('/:id', services.get)
router.get('/serv/:id', services.getService)
router.get('/teste', services.teste)
router.put('/update/:id', services.UpdateService)
router.delete('/delete/:id', services.DeleteService)
module.exports = router