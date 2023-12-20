const router = require('express').Router()
const Controller = require('../controllers/Auth.controller')
const { verifyAccessToken } = require('../Helpers/jwt_helper')

router.post('/login', Controller.login)

router.get('/profile', verifyAccessToken, Controller.profile)

module.exports = router
