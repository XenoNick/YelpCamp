const express = require('express')
const router = express.Router({ mergeParams: true })
const review = require('../controllers/reviews')
const { asyncWrapper } = require('../utilities/asyncCatcher')
const { isLoggedIn, validateReview, checkReviewAuth } = require('../middleware')


router.post('/', isLoggedIn, validateReview, asyncWrapper(review.createReview))

router.delete('/:reviewId', isLoggedIn, checkReviewAuth, asyncWrapper(review.deleteReview))

module.exports = router