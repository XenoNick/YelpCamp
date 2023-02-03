const express = require('express')
const passport = require('passport')
const router = express.Router()
const user = require('../controllers/users')
const { asyncWrapper } = require('../utilities/asyncCatcher')


router.route('/register')
    .get(user.renderRegisterForm)
    .post(user.createUser)

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), user.loginUser)

router.post('/logout', user.logoutUser)

module.exports = router