
// importing main grageo index
const grageoLibrary = require('../../grageo');

// message enum for consistency between server and client communications
const MessageType = require('../../shared/message');

// storing grageo main module
const g = grageoLibrary.grageo;

const Vector = grageoLibrary.vector;
const Colour = grageoLibrary.colour;

// storing reference to canvas layers
var B = g.Layers.Background;
var M = g.Layers.Middle;
var F = g.Layers.Foreground;

// storing reference to Utility methods
const Util = g.Util;

// importing ball container test
const BallContainer = require('./Balls').BallContainer;


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
    console.log("PLAYER JOINED!");
    bc.addBall();
  })

  // initialising tictactoe
  socket.on(MessageType.INIT,(bundle) => {
    console.log("Client Recieved Initial Bundle",bundle);
  })

  // update for client bundle
  socket.on(MessageType.UPDATE,(bundle) => {
    // console.log("Client Recieved Update Bundle",bundle);
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
    M.rect(new Vector(),Util.size());

    M.fillCol(new Colour(0,0,0,1));
    // drawing room key
    M.text(100,'Raleway','center',new Vector(Util.size().x/2,Util.size().y/3),'Room Key:');
    M.text(200,'Raleway','center',new Vector(Util.size().x/2,Util.size().y*1.5/2),RoomKey);

  })


  // // setting click event hook in grageo
  g.Control.setClickEvent((e) => {
    // on click event ( probably not gonna be used )
    console.log("Clicked",e.x,e.y);
  })


})
