
var Entity = require('./entity.js')

var Vector = require('./vector')

var Util = require('./grageo').Util;

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

module.exports = Quad;
