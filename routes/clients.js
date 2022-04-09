const express= require('express')
const router= express.Router();
const client= require('../controllers/clients')
const multer= require('../multer.js')

router.post('/signup',client.SignUpClient)
router.post('/auth/login',client.Login)
router.post('/auth/confirmcode', client.VerifyConfirmationCode)
router.post('/refresh',client.RefreshToken)
router.post('/clientimage',multer.single('file'),client.UploadImage)
router.post('/update',client.UpdateClient)
router.post('/resetpassword',client.resetPassword)
router.post('/verifyresetpasswordcode',client.VerifyResetPasswordCode)


module.exports= router