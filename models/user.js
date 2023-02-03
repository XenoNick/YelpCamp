const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Email allready in use!']
    }
})
userSchema.plugin(passportLocalMongoose);

const User = model('User', userSchema)
module.exports = User