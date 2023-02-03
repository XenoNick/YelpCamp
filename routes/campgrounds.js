const express = require('express')
const router = express.Router()
const { asyncWrapper } = require('../utilities/asyncCatcher')
const { isLoggedIn, validateCampground, checkAuth } = require('../middleware')
const campground = require('../controllers/campgrounds')
const { storage } = require('../cloudinary');
const multer = require('multer')
const Campground = require('../models/campground')
const upload = multer({ storage })

router.route('/')
    .get(asyncWrapper(campground.index))
    .post(isLoggedIn, upload.array('image', 5), validateCampground, asyncWrapper(campground.createCampground))

router.get('/new', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(asyncWrapper(campground.showCampground))
    .put(isLoggedIn, checkAuth, validateCampground, asyncWrapper(campground.updateCampground))
    .delete(isLoggedIn, checkAuth, asyncWrapper(campground.deleteCampgrounds))

router.get('/:id/edit', isLoggedIn, checkAuth, asyncWrapper(campground.renderEditForm))

router.get('/:id/images/edit', isLoggedIn, checkAuth, asyncWrapper(campground.renderEditImagesForm))

router.route('/:id/images')
    .put(isLoggedIn, checkAuth, upload.array('image', 5), asyncWrapper(campground.updateImages))
    .delete(isLoggedIn, checkAuth, asyncWrapper(campground.deleteImages))

module.exports = router