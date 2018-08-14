//
var express = require('express');

//
var path = require('path');

//
var favicon = require('serve-favicon');

//
var logger = require('morgan');

// app objext
var app = express();

// requires the dot env package which reads the env file properly
require('dotenv').config();

// importing ( extra code ) for templating system
require('./templating')(app);

//
app.use(logger('dev'));

// setting up request routing
require('./routes').init(app);

var serverController = require('./game/server/serverController.js')

// setting server controller frame rate
serverController.init(60);

module.exports = app;
