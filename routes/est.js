const express= require('express')
const router= express.Router();
const est= require('../controllers/est')
const verify= require('../middleware/verify')
const multer= require('../multer.js')


router.post('/post',multer.single('file'),est.est)
router.get('/:categoryId',est.get)


module.exports= router