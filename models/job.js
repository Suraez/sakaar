const Joi = require('joi')
const mongoose = require('mongoose')
const { User, userSchema } = require('./user')

const jobSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 5, maxlength: 50},
    description: {type: String, required: true, minlength: 5, maxlength: 255},
    categories: {
        type: Array,
        validate: {
            validator: function(v){
                return v && v.length > 0
            },
            message: 'Categories should have at least one tag.'
        }
    },
    budget: {type: Number, required: true, min: 100},
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    //better implementation
    user: {
        type: userSchema,
        required: true
    }
})

const Job = mongoose.model('Job', jobSchema);

function validateJob (job) {
    const schema  = {
        title: Joi.string().required().min(5).max(50),
        description: Joi.string().required().min(5).max(255),
        categories: Joi.array().required(),
        budget: Joi.number().required(),
        userId: Joi.string().required()
    }

    return Joi.validate(job, schema);
}

exports.validateJob = validateJob;
exports.Job = Job;
