const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res, next) => {
    const review = new Review(req.body.review)
    review.author = req.user
    const campground = await Campground.findById(req.params.campgroundId)
    campground.reviews.push(review)
    await campground.save();
    await review.save()
    req.flash('alerts', { style: 'success', message: 'Successfully created review!' })
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { campgroundId, reviewId } = req.params
    await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('alerts', { style: 'success', message: 'Successfully deleted review!' })
    res.redirect(`/campgrounds/${campgroundId}`)
}