const express= require('express')
const router= express.Router();
const category= require('../controllers/category')
const verify= require('../middleware/verify')
const multer= require('../multer.js')


router.post('/post',multer.single('file'),category.postCategory)
router.get('/',category.getCategory)


module.exports= router