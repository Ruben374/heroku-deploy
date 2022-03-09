const express= require('express')
const router= express.Router();
const users= require('../controllers/users')

router.post('/createuser',users.CreateUser)
router.post('/login',users.Login)
router.post("/api/auth/confirm", users.verifyUser)
//router.post('/refresh',clients.Refresh)


module.exports= router