
const Utilities = require('./Utilities');

class Vector {

  constructor(x=0,y=0,z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other){
    // console.logDD('VECTOR',other);
    this.x+=other.x;
    this.y+=other.y;
    this.z+=other.z;
    return this;
  }

  sub(other){
    this.x-=other.x;
    this.y-=other.y;
    this.z-=other.z;
    return this;
  }

  mul(other){
    this.x*=other.x;
    this.y*=other.y;
    this.z*=other.z;
    return this;
  }

  scale(scalar = null){

    if(scalar === null) {
      throw 'Scalar not defined'
      return this;
    }

    if(scalar instanceof Vector){
      return this.objectScale(scalar);
    } else {
      return this.singleScale(scalar);
    }
  }

  singleScale(scalar){
    this.x*=scalar;
    this.y*=scalar;
    this.z*=scalar;
    return this;
  }

  objectScale(scalar){
    this.x*=scalar.x;
    this.y*=scalar.y;
    this.z*=scalar.z;
    return this;
  }

  set(other){
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  // by default vector prints out x and y ( z is rarely used )
  toString(x = true,y = true,z = true){
    return "{ " + (x?this.x+' ':'') + (y?this.y+' ':'') + (z?this.z+' ':'') + '}'
  }

  random(){
    this.x = Utilities.random(-1,1);
    this.y = Utilities.random(-1,1);
    this.z = Utilities.random(-1,1);
    return this;
  }

  // this method returns a new vector that sits within the dimensions
  // the current vector ( used for random point within situations )
  randomWithin(){
    return new Vector(
      Utilities.random(1,this.x-1),
      Utilities.random(1,this.y-1),
      Utilities.random(1,this.z-1)
    )
  }

}

module.exports = Vector;
