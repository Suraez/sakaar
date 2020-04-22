const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
// const config = require('config');

const express = require('express');
const app = express();


// routes
const users = require('./routes/users');


// config settings
// if (!config.get('jwtPrivatekey')) {
//   console.error('Fatal error: config settings is not defined.')
//   process.exit(1);
// }


mongoose.connect('mongodb+srv://startup11:startup11@startup-cluster-jeh4j.mongodb.net/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
  .then(() => console.log('Connected to databases...'))
  .catch(err => console.error('Could not connect to database...',err.message));

app.use(express.json());


app.use('/user', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));