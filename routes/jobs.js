const {Job, validateJob} = require('../models/job')
const express = require('express')
const router = express.Router()
const { User } = require('../models/user')

// middleware
const authorization = require('../middleware/authorization')

router.get('/all', async (req, res) => {
    const jobs = await Job.find()
    res.send(jobs)
})

router.post('/create', authorization, async (req, res) => {

    const {error} = validateJob(req.body)
    if (error) return res.status(404).send(error.details[0].message)


    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).send('The user with the given Id not found')

    const job = new Job({
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        budget: req.body.budget,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password
        },
        time: req.body.time
    })

    job.save((err, result) => {
        if (err) return res.send(err.message)
        else return res.send(result)
    })
})

router.put('/update/:id',authorization, async(req, res) => {
    const {error} = validateJob(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).send('The user with the given Id not found')

    const job = await Job.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        budget: req.body.budget,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password
        },
        time: req.body.time
    }, {new: true})

    if (!job) return res.status(404).send('The job with the given id not found')
    res.send(job)
})


router.delete('/delete/:id',authorization, async(req, res) => {

    const job = await Job.findByIdAndDelete({_id: req.params.id})

    if (!job) return res.status(400).send("The job with the given ID not found")

    res.status(200).json({
        job,
        message: "Successfully deleted!!"
    })
})


module.exports = router