

// server controller module
var serverController = ( function() {

  // game loop module
  const gameloop = require('node-gameloop');

  // referencing socket module
  const io = require('../../socket.js');

  // importing lobby class
  const Lobby = require('./Lobby.js');

  // importing module enum for message types
  const MessageType = require('../shared/message');

  // method object
  var methods = {}

  // parameter object
  var params = {
    fps:60,
    fpsi: ( 1000 / 60 ),
    sps:60,
    framecount:0
  }

  var loop = null

  methods.init = (fps = 0,sps = 0) => {

    // setting run callback
    loop = gameloop.setGameLoop(methods.run,params.fpsi);
  }

  methods.start = () => {
    // nothing here yet
  }

  methods.stop = () => {
    gameloop.clearGameLoop(loop);
  }

  methods.run = (delta) => {

    params.framecount++

    // updating lobby object
    lobby.update();

    // when frame count hits fps
    if(params.framecount % Math.ceil(params.fps) === 0){
      // `delta` is the delta time from the last frame
      // console.log('[ Main Loop ] (frame=%s, delta=%s)', frameCount, delta);
    }

  }

  // setter to set fps interval
  methods.fps = (fps) => {
    params.fps  = fps;
    params.fpsi = 1000.0 / fps;
  }

  // intantiating lobby class with number of expected clients per room
  var lobby = new Lobby(1);

  // new connection entry point
  io.registerConnection((socket) => {

    // when a client requests to join the lobby
    socket.on(MessageType.JOIN,() => {

      // adding client to lobby
      lobby.addClient(socket);

      // outputting lobby details
      lobby.show();
    })

  })

  return {
    init:methods.init
  }

}());

module.exports = serverController;
