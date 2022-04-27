const express = require('express')
const router = express.Router()
const est = require('../controllers/est')
const verify = require('../middleware/verify')
const multer = require('../multer.js')

router.post('/post', multer.single('file'), est.est)
router.get('/:categoryId', est.get)
router.get('/estsuser/:userId', est.getEstsUser)
router.post('/rating', est.addStar)
router.post('/getrate', est.getRate)
router.patch('/uploadrate', est.ModifyRate)
router.get('/get/:id', est.getEst)
router.put('/update/est/:estId', est.updateEst)
router.post('/apaga', est.apaga)

module.exports = router
