
const Entity = require('./Entity');

const Utilities = require('./Utilities')

class Circle extends Entity {

  constructor(x,y,r){
    super(x,y,r,r);
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  area(){
    return this.size.x*this.size.x*Math.PI;
  }

  checkPointInCircle(otherPoint){
    return Utilities.dist(this.pos,otherPoint) < this.size.x;
  }

}
