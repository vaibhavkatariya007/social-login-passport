const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth');

const app = express();

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
app.use('/users', require('./routes/users'));

// start server
const port = process.env.port || 3000;
app.listen(port);
console.log(`server listining at port ${port}`);
