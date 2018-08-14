
var V = require('../lib/vector');

var grageo = (function(){

  // canvas DOM object
  var canvas = null;

  // canvas context
  var context = null;

  // size parameters
  var width = 0;
  var height = 0;

  var mouse = {
    x:0,
    y:0,
    down:false,
    up:false
  };

  // parameters for stateful control
  var Params = {
    resize:true,
    margin:0
  };

  // methods associated with inner administration of the library
  var Control = {}

  // sets initial size of canvas
  Control.size = () => {

    // setting global size variables
    width  = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;

    // assign new width and height to given canvas
    canvas.width  = width -10;
    canvas.height = height-10;

    canvas.style.width ='100%';
    canvas.style.height='100%';

  }

  // initial environment setup
  Control.setup = () => {

    // initial display method
    console.log("Grageo suited 'n' booted!")

    // establish canvas object for drawing
    canvas = document.createElement('canvas');

    canvas.id = 'grageo-canvas';

    // establishing canvas context
    context = canvas.getContext("2d");

    // appending canvas to body
    document.body.appendChild(canvas);

    // setting resize event to control method resonsible
    window.onresize = Control.size

    Control.size();

    // kicking off draw loop
    Control.loop(0);

    Control.setMouseMoveEvent((e) => {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
    });

    setUpEvents();

  }

  // user specifying canvas container
  Control.parent = (id) => {

    // creating temp object
    var fragment = document.createDocumentFragment();

    // storing parent container object
    var parent = document.getElementById(id);

    // checking parent exists
    if(parent){
      // migrating cavnas fragment into parent container
      parent.appendChild(canvas);

      Control.size();

    }

  }

  // events

  var mouseMoveEvents = [];

  // mouse up event callback array
  var mouseUpEvents = []

  // mouse down event callback array
  var mouseDownEvents = [];

  // click event callback array
  var clickEvents = [];

  function setUpEvents(){

    canvas.onmousemove = (event) => {
      mouseMoveEvents.map((e,i,a) => e(event));
    }

    canvas.onmouseup = (event) => {

      mouseUpEvents.map((e,i,a) => e(event));

      mouse.down = false;
      mouse.up   = true;

    }

    canvas.onmousedown = (event) => {

      mouseDownEvents.map((e,i,a) => e(event));

      mouse.down = true;
      mouse.up   = false;

    }

    canvas.onclick = (event) => {
      clickEvents.map((e,i,a) => e(event));
    }

  }

  Control.setMouseUpEvent = (callback) => {
    mouseUpEvents.push(callback)
  }

  Control.setMouseDownEvent = (callback) => {
    mouseDownEvents.push(callback)
  }

  Control.setMouseMoveEvent = (callback) => {
    mouseMoveEvents.push(callback)
  }

  // method to register new callback to array
  Control.setClickEvent = (callback) => {
    // push new callback to click events
    clickEvents.push(callback);
  }



  // desired loop fps
  var fps = 60;

  // total frame ticks
  var totalTick = 0;

  // time since last tick
  var lastRender = 0;

  // time since last second increment
  var lastSecond = 0;

  Control.loop = (time) => {

    // incrementing ticks
    totalTick++;

    // if the current time minus the time since the last frame poll is more than a second
    if(time - lastSecond > 1000){

      // update last second time
      lastSecond = time;

    }

    // calculating delta time
    let deltaTime = ((time - lastRender) / fps);

    // calculating progress time
    let progress = (Math.round(deltaTime * 10000) / 10000);

    // calling draw method ( with user hook )
    Draw.draw();

    // time since last render
    lastRender = time;

    // requesting new frame
    window.requestAnimationFrame(Control.loop.bind(this));

  }

  // methods associated with drawing to a canvas
  var Draw = {}

  Control.setDraw = (callback) => {
    if(typeof callback === 'function')
      Draw.draw = callback;
  }

  // draw method hook in
  Draw.draw = () => {
    Draw.text(100,'Ariel','center',new V(width/2,height/2),'No Draw Hook In');
  }

  Draw.text = (size = 40,font = "Ariel",align = "center",position = {x:0,y:0},body = "textbody",weight = 'normal') => {
    context.textAlign = align;
    context.font = weight + ' ' + size + "px " + font;
    context.fillText(body,position.x,position.y);
  }

  // canvas circle draw method
  Draw.circle = (start,radius) => {
    context.beginPath();
    context.arc(start.x,start.y,radius,0,2*Math.PI,false);
    context.fill()
  }

  Draw.arc = (position,radius,start,end) => {
    context.beginPath();
    context.arc(position.x,position.y,radius,start,end);
    context.stroke();
  }

  //
  Draw.line = (start,end,w = 1,fill = '#000000') => {
    context.beginPath();
    context.moveTo(start.x,start.y);
    context.lineTo(  end.x,end.y);
    context.lineWidth = w;
    Draw.stroke(w,fill);
  }

  Draw.background = (fill) => {
    Draw.fillCol(fill);
    Draw.rect(new V(0,0),new V(width,height))
  }

  //
  Draw.rect = (start,size) => {
    context.fillRect(start.x,start.y,size.x,size.y);
  }

  Draw.rectOutline = (start,size,w = 1,fill = "#000000") => {
    context.strokeRect(20,20,150,100);
    context.strokeStyle = fill;
    context.lineWidth = w;
  }

  Draw.rectOutlineRadius = (start,size,radius,w = 1,fill = "#000000") => {
    context.strokeRect(20,20,150,100);
    context.strokeStyle = fill;
    context.lineWidth = w;
  }

  Draw.stroke = (w = 1,fill = "#000000") => {
    context.lineWidth = w;
    context.strokeStyle = fill;
    context.stroke();
  }

  Draw.fillRGBA = (r,g,b,a = 1.0) => {
    context.fillStyle = 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')';
  }

  Draw.fillCol = (c) => {
    Draw.fillRGBA(c.r,c.g,c.b,c.a);
  }

  // methods associated with performing utilites on shape objects
  var Util = {}

  // when page is ready
  // window.onload = () => {
    // running initial setup
  // }

  // this method returns a vector of the width and height of the canvas
  Util.size = () => {
    return new V(width,height);
  }

  // this method returns a vector pointing to the center of the canvas
  Util.middle = () => {
    return Util.size().scale(0.5);
  }

  Util.mouse = () => {
    return mouse;
  }

  Util.random = (min = 0,max = 1) => {
    return Math.random() * (max - min) + min;
  }

  Util.randomInt = (min = 0, max = 1) => {
    return Math.round(Util.random(min,max))
  }

  Util.pyth = (v) => {
    return Math.sqrt((v.x * v.x) + (v.y + v.y))
  }

  Control.setup();

  return {
    Draw:Draw,
    Util:Util,
    Control:Control,
  }

}());

module.exports = grageo;
