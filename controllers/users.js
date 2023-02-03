const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('alerts', { style: 'success', message: 'Welcome to YelpCamp!!' })
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('alerts', { style: 'danger', message: error.message })
        res.redirect('/users/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('alerts', { style: 'success', message: 'Welcome back!' })
    res.redirect('/campgrounds')
}

module.exports.logoutUser = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/campgrounds')
    req.logOut((err) => {
        if (err) return next(err);
        req.flash('alerts', { style: 'success', message: 'Goodbye!' })
        res.redirect('/campgrounds')
    })
}