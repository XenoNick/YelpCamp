const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String, 
    filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_300,h_200')
})

const opts = {toJSON: {virtuals: true}}

const campGroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            reuired: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts)

campGroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

campGroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<strong><a href="campgrounds/${this._id}">${this.title}</a></strong>`
})

const Campground = mongoose.model('Campground', campGroundSchema);
module.exports = Campground;