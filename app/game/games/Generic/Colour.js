
// importing Util
const Utilities = require('./Utilities');

class Colour {

  constructor(r=0,g=0,b=0,a=1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getR(){
    return this.r;
  }

  getG(){
    return this.g;
  }

  getB(){
    return this.b;
  }

  getA(){
    return this.a;
  }

  getHex(){

    let r = this.r * this.a + 255 * ( 1 - this.a );
    let g = this.g * this.a + 255 * ( 1 - this.a );
    let b = this.b * this.a + 255 * ( 1 - this.a );

    return '#' + r.toString(16) + g.toString(16) + b.toString(16)

  }

  set(colour){
    this.r = colour.r;
    this.g = colour.g;
    this.b = colour.b;
    this.a = colour.a;
    return this;
  }

  setR(r){
    this.r = r;
    return this;
  }

  setG(g){
    this.g = g;
    return this;
  }

  setB(b){
    this.b = b;
    return this;
  }

  setA(a){
    this.a = a;
    return this;
  }

  add(colour){
    this.r += colour.r
    this.g += colour.g
    this.b += colour.b
    this.a += colour.a
    return this;
  }

  addWrap(colour){
    this.r = ( ( colour.r < 0 ? 255-colour.r : colour.r ) + this.r ) % 255
    this.g = ( ( colour.g < 0 ? 255-colour.g : colour.g ) + this.g ) % 255
    this.b = ( ( colour.b < 0 ? 255-colour.b : colour.b ) + this.b ) % 255
    this.a = ( ( colour.a < 0 ? 255-colour.a : colour.a ) + this.a ) % 255
    return this;
  }

  random(){
    this.r = Utilities.random(0,255)
    this.g = Utilities.random(0,255)
    this.b = Utilities.random(0,255)
    this.a = 1;
    return this;
  }

}

module.exports = Colour;
