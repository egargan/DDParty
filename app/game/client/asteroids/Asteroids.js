
const g = require('../../grageo');

// importing useful modules
const Vector = g.Vector;
const Colour = g.Colour;
const Entity = g.Entity.Entity;
const Circle = g.Entity.Circle;

// storing access to middle canvas layer
const M = g.Layers.Middle;

// storing access to utility methods
const U = g.Utility;

class Asteroids {

  constructor() {

    this.asteroids = [];

    this.bundle = null;

  }

  setBundle(bundle){
    this.bundle = bundle;
  }

  update(delta){

    this.asteroids = [];

    if(this.bundle){

      for(var p in this.bundle.players){

        let player = this.bundle.players[p]

        this.asteroids.push(new Asteroid(player.pos,player.size,player.direction));

      }

    }
  }

  draw(){
    for(var asteroid of this.asteroids){
      asteroid.draw()
    }
  }

}

class Asteroid extends Circle {

  constructor(pos,size,direction){

    super(pos.x,pos.y,size.x,size.y)

    this.direction = direction;

    // setting colour randomly
    this.setColour(new Colour());
    this.getColour().random();

  }

  draw(){
    M.fillCol(this.getColour());
    M.circle(this.pos,this.size.x);

    let polar = U.polarLine(this.pos,this.direction,100);

    M.line(this.pos,polar,10);


  }

}

module.exports = Asteroids;
