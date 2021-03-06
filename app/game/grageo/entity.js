
const Vector = require('./vector');

const Colour = require('./colour')

const Util   = require('./utility')

class Entity {

  constructor(x,y,sx,sy){

    // setting entity position
    this.pos = new Vector(x,y);

    // setting entity size
    this.size = new Vector(sx,sy);

    // entity default colour`
    this.colour = new Colour(255,0,255,1);

    // long hand default layer is middle
    this.layer = require('./grageo').Layers.Middle;

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

  getLayer(){
    return this.layer;
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

  setLayer(layer){
    this.layer = layer;
  }

  update(deltaTime){}

  draw(){}

}

var DrawMode = {
  ORIGIN:"origin",
  CENTER:"center"
}

var RectSide = {
  TOP:'top',
  BOTTOM:'bottom',
  LEFT:'left',
  RIGHT:'right'
}

class Circle extends Entity {

  constructor(x,y,r){
    super(x,y,r,r);
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(){
    this.layer.fillCol(this.colour);
    this.layer.circle(this.pos,this.size.x)
  }

  area(){
    return this.size.x*this.size.x*Math.PI;
  }

  checkPointInCircle(otherPoint){
    return Utility.dist(this.pos,otherPoint) < this.size.x;
  }

}

class Rectangle extends Entity {

  constructor(x,y,w,h){
    super(x,y,w,h);
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(){
    this.layer.fillCol(this.colour);
    this.layer.rect(this.pos,this.size);
  }

  area(){
    return this.size.x*this.size.y;
  }

  checkPointInRectangle(otherPoint){
    return (otherPoint.x > this.pos.x && otherPoint.x < this.pos.x + this.size.x && otherPoint.y > this.pos.y && otherPoint.y < this.pos.y + this.size.y);
  }

  checkRectangleinRectangle(rectangle){
    return (this.pos.x <= rectangle.pos.x && this.pos.x + this.size.x >= rectangle.pos.x + rectangle.size.x &&
            this.pos.y <= rectangle.pos.y && this.pos.y + this.size.y >= rectangle.pos.y + rectangle.size.y);
  }

  checkSide(point){
    if(this.checkLeft(point))   return RectSide.LEFT;
    if(this.checkRight(point))  return RectSide.RIGHT;
    if(this.checkTop(point))    return RectSide.TOP;
    if(this.checkBottom(point)) return RectSide.BOTTOM;
  }

  checkLeft(point){
    return (point.x <= this.pos.x && point.y >= this.pos.y && point.y <= this.pos.y + this.size.y);
  }

  checkRight(point){
    return (point.x >= this.pos.x + this.size.x && point.y >= this.pos.y && point.y <= this.pos.y + this.size.y);
  }

  checkTop(point){
    return (point.x >= this.pos.x && point.x <= this.pos.x + this.size.x && point.y <= this.pos.y);
  }

  checkBottom(point){
    return (point.x >= this.pos.x && point.x <= this.pos.x + this.size.x && point.y >= this.pos.y + this.size.y);
  }

}

class Quad extends Entity {

  constructor(x,y,w,h){
    super(x,y,w,h);

    // rotational angle of quad
    this.direction = 0;

    // rotational increment
    this.offset = 0;

    //positions of polygon
    // 0 - top left
    // 1 - top right
    // 2 - bottom right
    // 3 - bottom left
    this.points = [
      new Vector(this.pos.x-(this.size.x/2),this.pos.y-(this.size.y/2)),
      new Vector(this.pos.x+(this.size.x/2),this.pos.y-(this.size.y/2)),
      new Vector(this.pos.x+(this.size.x/2),this.pos.y+(this.size.y/2)),
      new Vector(this.pos.x-(this.size.x/2),this.pos.y+(this.size.y/2))
    ]

  }

  getDirection(){
    return this.direction;
  }

  getOffset(){
    return this.offset;
  }

  setDirection(direction){
    this.direction = direction;
  }

  setOffset(offset){
    this.offset = offset;
  }



  // rotate all points
  updatePoints(){

    //positions of polygon
    // 0 - top left
    // 1 - top right
    // 2 - bottom right
    // 3 - bottom left
    this.points = [
      new Vector(this.pos.x-(this.size.x/2),this.pos.y-(this.size.y/2)),
      new Vector(this.pos.x+(this.size.x/2),this.pos.y-(this.size.y/2)),
      new Vector(this.pos.x+(this.size.x/2),this.pos.y+(this.size.y/2)),
      new Vector(this.pos.x-(this.size.x/2),this.pos.y+(this.size.y/2))
    ]

  }

  updateRotation(){

    // copying points to new array
    for(var point of this.points){

      // origin offset point
      let p = new Vector(point.x,point.y).sub(this.pos);

      // new point memory
      let np = new Vector();

      np.x = (p.x * Math.cos(Util.radians(this.direction))) - (p.y * Math.sin(Util.radians(this.direction))) ;
      np.y = (p.x * Math.sin(Util.radians(this.direction))) + (p.y * Math.cos(Util.radians(this.direction))) ;

      np.add(this.pos);

      point.set(np);

    }

  }

  update(deltaTime){

    super.update(deltaTime);

    this.updatePoints()

    this.updateRotation()

    this.direction+=this.offset;

  }

  draw(){
    super.draw();
    this.layer.fillCol(this.colour);
    this.layer.polygon(this.pos,this.points);
  }

}

module.exports.Entity = Entity;
module.exports.Circle = Circle;
module.exports.Rectangle = Rectangle;
module.exports.Quad = Quad;
