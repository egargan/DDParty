
const Entity = require('./Entity');

const Utilities = require('./Utilities');

const Vector = require('./Vector');

class PhysEntity extends Entity {

  constructor(pos,size){

    super(pos.x,pos.y,size.x,size.y)

    this.vel = new Vector(0,0);

    this.acc = new Vector(0,0);

    this.friction = new Vector(0,0);

  }

  update(deltaTime){}

}

module.exports = Entity;
