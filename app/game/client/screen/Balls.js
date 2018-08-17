
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

    this.balls = []

    this.addBall();

  }

  addBall(){
    this.balls.push(new Ball(U.randomScreen(),U.random(30,70)))
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
    this.setColour(new Colour());
    this.getColour().random();

  }

  update(){

    // this.pos.add(new Vector(U.random(-1,1),U.random(-1,1)));

    this.pos.add(new Vector().random());

    if(this.pos.x - this.size.x < 0)
      this.pos.x = this.size.x;

    else if(this.pos.x + this.size.x > U.size().x)
      this.pos.x = U.size().x - this.size.x;

    if(this.pos.y - this.size.x < 0)
      this.pos.y = this.size.y;

    else if(this.pos.y + this.size.x > U.size().y)
      this.pos.y = U.size().y - this.size.y;

  }

  draw(){
    M.fillCol(this.getColour());
    M.circle(this.pos,this.size.x);
  }

}

module.exports.Ball = Ball;
