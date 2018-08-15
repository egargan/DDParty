
const glib = require('../../grageo');

// grageo main module
const grageo = glib.grageo;

// importing useful modules
const Vector = glib.vector;
const Colour = glib.colour;
const Entity = glib.basic.Entity;

// storing access to middle canvas layer
const M = grageo.Layers.Middle;

// storing access to utility methods
const Util = grageo.Util;

class BallContainer {

  constructor() {

    this.balls = []

    for(var b = 0 ; b < 4000 ; b++){
      this.balls.push(new Ball(Util.randomScreen(),Util.random(10,20)))
    }

  }

  update(delta){
    for(var ball of this.balls){
      ball.update(delta);
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
    this.setColour(new Colour().random())

  }

  update(){

    this.pos.add(new Vector(Util.random(-1,1),Util.random(-1,1)));

    if(this.pos.x - this.size.x < 0)
      this.pos.x = this.size.x;

    else if(this.pos.x + this.size.x > Util.size().x)
      this.pos.x = Util.size().x - this.size.x;

    if(this.pos.y - this.size.x < 0)
      this.pos.y = this.size.y;

    else if(this.pos.y + this.size.x > Util.size().y)
      this.pos.y = Util.size().y - this.size.y;

  }

  draw(){
    M.fillCol(this.getColour());
    M.circle(this.pos,this.size.x);
  }

}

module.exports.Ball = Ball;
