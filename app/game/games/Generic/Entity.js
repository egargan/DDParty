
const Vector = require('./Vector');

const Colour = require('./Colour');

class Entity {

  constructor(x,y,sx,sy){

    // setting entity position
    this.pos = new Vector(x,y);

    // setting entity size
    this.size = new Vector(sx,sy);

    // entity default colour`
    this.colour = new Colour(255,0,255,1);

  }

  getPos(){
    return this.pos;
  }

  getSize(){
    return this.size;
  }

  getColour(){
    return this.colour;
  }
  
  setPos(pos){
    this.pos.set(pos);
  }

  setSize(size){
    this.size.set(size);
  }

  // takes a colour object
  setColour(col){
    this.colour.set(col)
  }

  update(deltaTime){}

}

module.exports = Entity;
