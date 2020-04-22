const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50},
    email: {type: String, required: true, unique: true, minlength: 5, maxlength: 255},
    password: {type: String, required: true, minlength: 5, maxlength: 1024},
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, 'jwtPrivateKey')
    return token;
}
const User = mongoose.model('User', userSchema);

function validateuser (user) {
    const schema  = {
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).max(1024).required()
    }

    return Joi.validate(user, schema);
}

exports.validateuser = validateuser;
exports.User = User;
