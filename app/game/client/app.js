
const GRAGEO_DIRECTORY = '../lib/grageo';

// storing reference to grageo
const g = require('../lib/grageo/grageo.js');

const Colour = require('../lib/grageo/colour.js')

const Vector = require('../lib/grageo/vector.js')

const Quad = require('../lib/grageo/quad.js')

// storing reference to canvas layers
var B = g.Layers.Background;
var M = g.Layers.Middle;
var F = g.Layers.Foreground;

// storing reference to Utility methods
const Util = g.Util;

g.Setup(() => {

  console.log("Setting Up Grageo");


  // setting canvas parent container
  g.Control.parent('canvas-container');

  g.Control.setFullScreen();

  // g.Control.setSize(new Vector(500,500))

})

var brush = new Colour(0,0,0);

var previous = new Vector(0,0);

var rec = new Quad(0,0,80,200);

var rec2 = new Quad(0,0,70,190);
rec2.setLayer(F)

var rot = 0;

// update method hook
g.Control.setUpdate((delta) => {

  brush.addWrap(new Colour(-10,0,10,1))

  rec.setPos(Util.mouse())
  rec.update(delta)

  rec2.setPos(Util.mouse())
  rec2.update(delta)

})

// draw loop callback
g.Control.setDraw (() => {


  B.clear();
  B.background(new Colour(255,0,0,0.3333))

  M.clear();
  M.background(new Colour(0,255,0,0.3333))

  F.clear();
  F.background(new Colour(0,0,255,0.3333))

  // M.clear();
  // F.clear();

  rec.setColour(new Colour(0,0,0))
  rec.draw();
  //
  rec2.draw();

})


// // setting click event hook in grageo
g.Control.setClickEvent((e) => {
  console.log("Clicked",e.x,e.y);
  // on click event ( probably not gonna be used )
})
