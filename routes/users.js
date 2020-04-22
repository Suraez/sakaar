const {User, validateuser} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const authorization = require('../middleware/authorization')

router.get('/me', authorization, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user);
})

router.post('/signup', async(req, res) => {
  const { error } = validateuser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
 
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt =await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(user.password, salt)

  await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

router.post('/signin', async (req, res) => {
  const { error } = validateLogin(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('No user found with the given credentials.');

  const matchPassword = await bcrypt.compare(req.body.password, user.password)
  if (!matchPassword) return res.status(400).send('Invalid password')
  const token = user.generateAuthToken();
  res.send(token)
})

function validateLogin (req) {
  const schema  = {
      email: Joi.string().required().email(),
      password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema);
}
module.exports = router; 