
const Entity = require('./Entity');

const RectSide = {
  TOP:'top',
  BOTTOM:'bottom',
  LEFT:'left',
  RIGHT:'right'
}

class Rectangle extends Entity {

  constructor(x,y,w,h){
    super(x,y,w,h);
  }

  update(deltaTime){
    super.update(deltaTime);
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

module.exports = Rectangle;
