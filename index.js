#!/usr/bin/env node


// initialising first as useful for all aspects of code
var utilities = require('./app/utilities');
utilities.init();

/**
 * Module dependencies.
 */

var app = require('./app/app.js');

var http = require('http');

/**
* Create HTTP server.
*/

var server = http.createServer(app);

utilities.storeServer(server);

// var io = require('socket.io')(server);

// importing socket io module
var io = require('./app/socket.js').init(server);


/**
 * Get port from environment and store in Express.
 */

var port = utilities.normalisePort(process.env.PORT || '3000');

app.set('port', port);

console.logDD('INDEX','Server Listening on Port :'+port)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

// server.on('error', utilities.onError);

server.on('error', (error) => {
  // return utilities.onError(error,port)

  utilities.onError(error,port)

});


server.on('listening', utilities.onListen);
