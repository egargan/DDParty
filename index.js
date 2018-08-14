#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app/app.js');

var http = require('http');

/**
* Create HTTP server.
*/

var server = http.createServer(app);

// var io = require('socket.io')(server);

// importing socket io module
var io = require('./app/socket.js').init(server);

var utilities = require('./app/utilities');

utilities.init(server);

/**
 * Get port from environment and store in Express.
 */

var port = utilities.normalisePort(process.env.PORT || '3000');

app.set('port', port);

console.log("Server Listening on Port :",port)

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
