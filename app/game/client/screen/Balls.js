
const g = require('../../grageo');

// importing useful modules
const Vector = g.Vector;
const Colour = g.Colour;
const Entity = g.Entity.Entity;

// storing access to middle canvas layer
const M = g.Layers.Middle;

// storing access to utility methods
const U = g.Utility;

class BallContainer {

  constructor() {

    this.balls = [];

    this.bundle = null;

  }

  setBundle(bundle){
    this.bundle = bundle;
  }

  update(delta){

    this.balls = [];

    if(this.bundle){

      for(var p in this.bundle.players){

        let player = this.bundle.players[p]

        let ball = new Ball(player.pos,player.size)

        this.balls.push(ball);

      }

    }

  }

  draw(){
    for(var ball of this.balls){
      ball.draw()
    }
  }

}

module.exports.BallContainer = BallContainer;

class Ball extends Entity {

  constructor(pos,size) {
    super(pos.x,pos.y,size,size);

    // setting colour randomly
    this.setColour(new Colour());
    this.getColour().random();

  }

  draw(){
    M.fillCol(this.getColour());
    M.circle(this.pos,this.size.x);
  }

}

module.exports.Ball = Ball;
