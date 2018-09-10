
// this class represents an entity with physical properties like
// acceleration, velocity, friction ( maybe collision )

var Entity = require('./entity').Entity;

class PhysicsEntity extends Entity {

  constructor(pos,size) {
    super(pos.x,pos.y,size.x,size.y)
  }

}

module.exports = PhysicsEntity;
