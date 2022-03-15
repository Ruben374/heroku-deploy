const express= require('express')
const router= express.Router();
const client= require('../controllers/clients')

router.post('/signup',client.SignUpClient)
router.post('/auth/login',client.Login)
router.post('/auth/confirmcode', client.VerifyConfirmationCode)
router.post('/refresh',client.RefreshToken)


module.exports= router