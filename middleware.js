const { campgroundSchema, reviewSchema } = require('./schemas')
const AppError = require('./utilities/expressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('alerts', { style: 'danger', message: 'Must be signed in!' })
        return res.redirect('/users/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ')
        throw new AppError(400, msg)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ')
        throw new AppError(400, msg)
    }
    next()
}

module.exports.checkAuth = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (req.user.equals(campground.author._id)) {
        return next()
    }
    req.flash('alerts', { style: 'danger', message: "You're not authorized to perform that action!" })
    res.redirect('/campgrounds')
}

module.exports.checkReviewAuth = async (req, res, next) => {
    const { reviewId, campgroundId } = req.params
    const review = await Review.findById(reviewId)
    if (req.user.equals(review.author._id)) {
        return next()
    }
    req.flash('alerts', { style: 'danger', message: "You're not authorized to perform that action!" })
    res.redirect(`/campgrounds/${campgroundId}`)
}