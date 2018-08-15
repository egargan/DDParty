
// importing Util
var Util = require('./grageo').Util;

class Vector {

  constructor(x=0,y=0,z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other){
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

  scale(scalar){
    this.x*=scalar;
    this.y*=scalar;
    this.z*=scalar;
    return this;
  }

  set(other){
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  // by default vector prints out x and y ( z is rarely used )
  toString(x = true,y = true,z = false){
    return "[ " + (x?this.x+' ':'') + (y?this.y+' ':'') + (z?this.z+' ':'') + ']'
  }

  // random(){
  //   this.x = Util.random(-1,1);
  //   this.y = Util.random(-1,1);
  //   this.z = Util.random(-1,1);
  //   return this;
  // }

}

module.exports = Vector;
