//
// const GRAGEO_DIRECTORY = '../grageo';
//
// // importing main grageo index
const grageoLibrary = require('../grageo');

// storing grageo main module
const g = grageoLibrary.grageo;

// storing colour module
const Colour = grageoLibrary.colour

// storing vector module
const Vector = grageoLibrary.vector

// storing quad module
const Quad = grageoLibrary.quad

// storing reference to canvas layers
var B = g.Layers.Background;
var M = g.Layers.Middle;
var F = g.Layers.Foreground;

// storing reference to Utility methods
const Util = g.Util;

g.Setup(() => {

  console.log("Setting Up Grageo");

  // setting canvas parent container
  g.Control.parent('grageo-container');

  // force full screen ( is usually automated )
  g.Control.setFullScreen();

})

// rectangle object
var rec = new Quad(0,0,80,200);

// update method hook
g.Control.setUpdate((delta) => {

  // set rectangle position
  rec.setPos(Util.mouse())

  rec.setOffset(1);

  //
  rec.update(delta)

})

// draw loop callback
g.Control.setDraw (() => {

  // B.clear();
  M.clear();
  // F.clear();

  //
  rec.setColour(new Colour(0,0,0))
  rec.draw();

})


// // setting click event hook in grageo
g.Control.setClickEvent((e) => {
  // on click event ( probably not gonna be used )
  console.log("Clicked",e.x,e.y);
})
