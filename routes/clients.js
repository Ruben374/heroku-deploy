const express= require('express')
const router= express.Router();
const clients= require('../controllers/clients')
const verify= require('../middleware/verify')


router.post('/createuser',clients.CreateUser)
router.post('/login',clients.Login)
router.post('/refresh',clients.Refresh)


module.exports= router