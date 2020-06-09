const Joi = require('joi')
const mongoose = require('mongoose')
const { User, userSchema } = require('./user')

const jobSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 5, maxlength: 50},
    description: {type: String, required: true, minlength: 5, maxlength: 255},
    categories: {
        type: String,
        required: true
        // validate: {
        //     validator: function(v){
        //         return v && v.length > 0
        //     },
        //     message: 'Categories should have at least one tag.'
        // }
    },
    budget: {type: String, required: true},
    time: {type: String, required: true},
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
        categories: Joi.string().required(),
        budget: Joi.string().required(),
        userId: Joi.string().required(),
        time: Joi.string().required(),
    }

    return Joi.validate(job, schema);
}

exports.validateJob = validateJob;
exports.Job = Job;
