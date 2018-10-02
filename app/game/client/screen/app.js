
// importing main grageo library from the index
const g = require('../../grageo');

// message enum for consistency between server and client communications
const MessageType = require('../../shared/message');

const Vector = g.Vector;
const Colour = g.Colour;

// storing reference to canvas layers
var B = g.Layers.Background;
var M = g.Layers.Middle;
var F = g.Layers.Foreground;

// storing reference to Utility methods
const U = g.Utility;

// importing ball container test
var BallContainer = require('./Balls').BallContainer

// socket initialisation
const socket = io();

var RoomKey = '';

socket.on('connect',(data) => {

  // socket connection ready

  // call to join lobby on server side
  socket.emit(MessageType.JOINSCREEN,() => {
    // nothing to do
  });

  socket.on(MessageType.ROOMKEY,(roomkey) => {
    console.log("Room Key Recieved - ",roomkey);
    RoomKey = roomkey;
  })

  // when player joins lobby append a player ball to lobby
  socket.on(MessageType.PLAYERJOINEDLOBBY,() => {
  })

  // initialising tictactoe
  socket.on(MessageType.INIT,(bundle) => {
    // console.log("Client Recieved Initial Bundle",bundle);
  })

  // update for client bundle
  socket.on(MessageType.UPDATE,(bundle) => {
    // console.log("Client Recieved Update Bundle",bundle);
    bc.setBundle(bundle);
  })

  // undefined behaviour, used to catch game destruction
  socket.on(MessageType.EJECT,() => {
    // nothign to do
  })

  var bc = null;

  g.Setup(() => {

    // console.log("Setting Up Grageo");

    // setting canvas parent container
    g.Control.parent('grageo-container');

    // force full screen ( is usually automated )
    g.Control.setFullScreen();

    g.Control.setResizeEvent(() => {
      // sending screen size
      socket.emit(MessageType.SCREENSIZE,U.size());
    })

    // sending initial screen size
    socket.emit(MessageType.SCREENSIZE,U.size());


    // when grageo has finished loading the page, this socket hook will send server info on screen size
    // socket.emit(MessageType.INIT,{
    //   screen : {
    //     x:U.size().x,
    //     y:U.size().y
    //   }
    // })

    // instantiating new ball container
    bc = new BallContainer();


  })

  // update method hook
  g.Control.setUpdate((delta) => {

    bc.update(delta);

  })

  // draw loop callback
  g.Control.setDraw (() => {

    // clearing all layers
    B.clear();
    M.clear();
    F.clear();

    //
    bc.draw();

    M.fillCol(new Colour(255,255,255,0.5));
    M.rect(new Vector(),U.size());

    M.fillCol(new Colour(0,0,0,1));
    // drawing room key
    M.text(100,'Raleway','center',new Vector(U.size().x/2,U.size().y/3),'Room Key:');
    M.text(200,'Raleway','center',new Vector(U.size().x/2,U.size().y*1.5/2),RoomKey);


  })


  // // setting click event hook in grageo
  g.Control.setClickEvent((e) => {
    // on click event ( probably not gonna be used )
    console.log("Clicked",e.x,e.y);
  })

  // g.Control.setScreen


})
