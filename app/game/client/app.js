//
// const GRAGEO_DIRECTORY = '../grageo';
//
// // importing main grageo index
const grageoLibrary = require('../grageo');

// storing grageo main module
const g = grageoLibrary.grageo;

// storing reference to canvas layers
var B = g.Layers.Background;
var M = g.Layers.Middle;
var F = g.Layers.Foreground;

// storing reference to Utility methods
const Util = g.Util;

// importing ball container test
const BallContainer = require('./Balls').BallContainer;

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

  B.clear();
  M.clear();
  F.clear();

  bc.draw();

})


// // setting click event hook in grageo
g.Control.setClickEvent((e) => {
  // on click event ( probably not gonna be used )
  console.log("Clicked",e.x,e.y);
})
