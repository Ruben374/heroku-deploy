const express = require('express')
const router = express.Router()
const user = require('../controllers/users')

router.post('/signup', user.SignUpUser)
router.post('/auth/login', user.Login)
router.post('/auth/confirmcode', user.VerifyConfirmationCode)
router.post('/refresh', user.RefreshToken)

module.exports = router
