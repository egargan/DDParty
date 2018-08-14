var methods = {}


methods.init = (server) => {

  methods.server = server;

  // this method returns the last element in the array
  Array.prototype.last = function () {
    return this[this.length-1]
  }

  // this method returns an element at the index decrimented from the back
  Array.prototype.inward = function (index) {
    return this[this.length - 1 - ( index || 0 )];
  }

  // this method splices from the back of an array
  Array.prototype.inwardSplice = function (index,depth) {
    if(this.length-1-index >= depth){
      return this.splice(this.length-1-index-depth,depth);
    }
    return this;
  }

}

var hash = require('object-hash');

methods.hashObj = (obj) => {
  try {
    return hash(obj);
  } catch(err){
    return hash({ time:Date.now() });
  }
}

methods.normalisePort = (val) => {

  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;

};

methods.onError = (error,port) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }

}

methods.onListen = () => {

  var addr = methods.server.address();

  var bind = typeof addr === 'string'

    ? 'pipe ' + addr
    : 'port ' + addr.port;

  var debug = require('debug')('cc-express:server');

  debug('Listening on ' + bind);

}


module.exports = methods
