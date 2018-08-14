
module.exports.socket = null;

// call back for new connections
module.exports.onConnect = () => null;

// setter for new connection callback
module.exports.registerConnection = (callback) => {
  module.exports.onConnect = callback;
}

// generic on message type callback
module.exports.registerOn = (message,hook) => {
  module.exports.socket.on(message,hook)
}

// method in charge of setting up anti spam system
module.exports.antiSpam = (io) => {

  // anti spam module
  var SocketAntiSpam  = require('socket-anti-spam')

  // settting up anti spam object
  var sas = new SocketAntiSpam({
    banTime:            0,         // Ban time in minutes
    kickThreshold:      10,          // User gets kicked after this many spam score
    kickTimesBeforeBan: 1,          // User gets banned after this many kicks
    banning:            false,       // Uses temp IP banning after kickTimesBeforeBan
    kicking:            false,       // Uses temp IP banning after kickTimesBeforeBan
    'io':               io,  // Bind the socket.io variable
    // redis:              client,      // Redis client if you are sharing multiple servers
  })

  sas.event.on('kick',(socket,data) => {
    console.log("KICK: ",data);
  });

  sas.event.on('ban',(data) => {
    console.log("BAN: ",data);
  });

}

// initialiser for socket module
module.exports.init = (server) => {

  // importing socket io module
  var io = require('socket.io')(server);

  // method which sets up anti spam system
  // module.exports.antiSpam(io);

  // storing io locallly
  module.exports.socket = io;

  io.sockets.on('connection', function(socket) {
      module.exports.onConnect(socket);
   });


}
