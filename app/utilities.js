var methods = {}


methods.init = (server) => {

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

  console.logDD = (owner,message,index) => {

    let pad = ' ';
    pad = pad.repeat(10 - owner.length);

    console.log(
      '[',
        new Date().toLocaleDateString("en-US"),
        new Date().toLocaleTimeString('en-US'),
      ']',
      owner+pad+' ',
      ' - ',
      message
    );
  }

}

methods.storeServer = (server) => {
  methods.server = server;
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

// Generates a new key
// Returns a key which is a string of length 5 consisting
// of uppercase latin letters of length @length
methods.generateKeyString = (length = 10) => {
  // The possible symbols / character set the key can use
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let key = '';

  for(let char = 0; char < length; char++){
    // Chooses a random symbol from the set and appends it to the
    // key. This process is repeated until the desired length is reached
    key += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  // Returns the key
  return key;
}

module.exports = methods
