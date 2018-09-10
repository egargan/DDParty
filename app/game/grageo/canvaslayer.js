
//
const Vector = require('./vector');

// canvas layer object that has all important draw methods within it.
class CanvasLayer {

  constructor(id,order) {

    // layer id / name
    this.id = id;

    // ordering for canvas layer
    this.order = order;

    // canvas object node
    this.canvas = document.createElement('canvas');

    // reference id for canvas
    this.canvas.id = this.id;

    // z index layer for canvas
    this.canvas.style.zIndex = this.order;
    this.canvas.style.position = 'absolute';

    // canvas context
    this.context = this.canvas.getContext("2d");

    // parent node object
    this.parent = null;

    this.size = new Vector(0,0);

  }

  setup(){

  }

  // this method simply sets the parent of the canvas ( its container )
  setParent(node){
    node.appendChild(this.canvas);
    this.parent = node;
  }

  setSize(size,fullscreen){

    // setting local size variable
    this.size.set(size);

    // setting node dimensions
    this.canvas.width  = this.size.x;
    this.canvas.height = this.size.y;

    // setting style dimension
    this.canvas.style.width  = (fullscreen ? '100%' : this.size.x+'px');
    this.canvas.style.height = (fullscreen ? '100%' : this.size.y+'px');

  }



  text(size = 40,font = "Ariel",align = "center",position = {x:0,y:0},body = "textbody",weight = 'normal')  {
    this.context.textAlign = align;
    this.context.font = weight + ' ' + size + "px " + font;
    this.context.fillText(body,position.x,position.y);
  }

  // canvas circle draw method
  circle(start,radius)  {
    this.context.beginPath();
    this.context.arc(start.x,start.y,radius,0,2*Math.PI,false);
    this.context.fill()
  }

  arc(position,radius,start,end)  {
    this.context.beginPath();
    this.context.arc(position.x,position.y,radius,start,end);
    this.context.stroke();
  }

  //
  line(start,end,w = 1,fill = '#000000')  {
    this.context.beginPath();
    this.context.moveTo(start.x,start.y);
    this.context.lineTo(  end.x,end.y);
    this.context.lineWidth = w;
    this.stroke(w,fill);
  }

  background(fill)  {
    this.fillCol(fill);
    this.rect(new Vector(0,0),this.size)
  }

  //
  rect(start,size)  {
    this.context.fillRect(start.x,start.y,size.x,size.y);
  }

  rectOutline(start,size,w = 1,fill = "#000000")  {
    this.context.strokeRect(20,20,150,100);
    this.context.strokeStyle = fill;
    this.context.lineWidth = w;
  }

  rectOutlineRadius(start,size,radius,w = 1,fill = "#000000")  {
    this.context.strokeRect(20,20,150,100);
    this.context.strokeStyle = fill;
    this.context.lineWidth = w;
  }

  polygon(start,points)  {
    this.context.beginPath();
    this.context.moveTo(points[0].x,points[0].y);
    for(var i = 1 ; i < points.length ; i++ ){
      this.context.lineTo(points[i].x,points[i].y);
    }
    this.context.closePath();
    this.context.fill();
  }

  stroke(w = 1,fill = "#000000")  {
    this.context.lineWidth = w;
    this.context.strokeStyle = fill;
    this.context.stroke();
  }

  fillRGBA(r,g,b,a = 1.0)  {
    this.context.fillStyle = 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')';
  }

  fillCol(c)  {
    this.fillRGBA(c.r,c.g,c.b,c.a);
  }

  clear()  {
    this.context.clearRect(0,0,this.size.x,this.size.y);
  }

}

module.exports = CanvasLayer;
