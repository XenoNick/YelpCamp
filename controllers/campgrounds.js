const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    for (let image of req.files) {
        campground.images.push({ url: image.path, filename: image.filename })
    }
    campground.author = req.user
    await campground.save()
    console.log(campground)
    req.flash('alerts', { style: 'success', message: 'Campground was successfully created!' })
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author', select: 'username' } }).populate('author', 'username')
    // console.log(campground)
    if (!campground) {
        req.flash('alerts', { style: 'danger', message: 'Campground does not exist!' })
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('alerts', { style: 'danger', message: 'Page does not exist!' })
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}
module.exports.renderEditImagesForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('alerts', { style: 'danger', message: 'Page does not exist!' })
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/editImages', { campground })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params
    const { campground } = req.body
    await Campground.findByIdAndUpdate(id, { ...campground })
    req.flash('alerts', { style: 'success', message: 'Campground successfully updated!' })
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampgrounds = async (req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('alerts', { style: 'success', message: 'Campground successfully deleted!' })
    res.redirect('/campgrounds')
}

module.exports.updateImages = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    for (let image of req.files) {
        campground.images.push({ url: image.path, filename: image.filename })
    }
    await campground.save()
    req.flash('alerts', { style: 'success', message: 'Images successfully uploaded!' })
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteImages = async (req, res) => {
    const { deleteImages } = req.body
    const { id } = req.params
    if (!deleteImages) {
        req.flash('alerts', { style: 'danger', message: 'Nothing to delete!' })
        return res.redirect(`/campgrounds/${id}/images/edit`)
    }
    for (let filename of deleteImages) {
        cloudinary.uploader.destroy(filename)
    }
    const campground = await Campground.findById(id)
    await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } })
    req.flash('alerts', { style: 'success', message: 'Images have been successfully removed!' })
    res.redirect(`/campgrounds/${id}/images/edit`)
}