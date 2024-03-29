const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    organisation: {
        type: String
    },
    password: {
        type: String
    },
    biography: {
        type: String
    },
    profilePicture: {
        type: String
    }
}, {timestamps: true})


const User = mongoose.model('User', userSchema)
module.exports = User