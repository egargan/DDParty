
var grageo = (function(){

  //
  const Utility = require('./utility');

  const Vector = require('./vector');

  const Colour = require('./colour');

  const Entity = require('./entity');

  const CanvasLayer = require('./canvaslayer');

  // canvas layers
  var Layers = {
    Background:new CanvasLayer('Grageo-Background',0),
    Middle:new CanvasLayer('Grageo-Middle',1),
    Foreground:new CanvasLayer('Grageo-Foreground',2)
  }

  // canvas parent node ( width default value )
  var Container = null;

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

  var mouseOld = {
    x:0,
    y:0,
    down:false,
    up:false
  };

  // parameters for stateful control
  var Params = {
    fullscreen:true,
    fixedsize: new Vector(100,100),
    resize:true,
    margin:0,
    ready:false,
    modifiedParent:false
  };

  // methods associated with inner administration of the library
  var Control = {}

  // initial environment setup
  Control.setup = () => {

    // initial display method
    console.log("Grageo suited 'n' booted!")

    // page load means body can be found
    parent = document.body;

    // creating and storing canvas globally
    // Control.createCanvas();

    // assume parent is default for setup
    Control.migrateCanvas(parent);

    // setting resize event to control method resonsible
    // window.onresize = Control.size;
    Control.setResizeEvent(Control.size)

    // forcing the function
    Control.size();

    Control.setMouseMoveEvent((e) => {

      // setting old mouse position
      mouseOld.x = mouse.x;
      mouseOld.y = mouse.y;

      // updating new mouse position
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;

    });

    setUpEvents();

    // running user setup method
    Setup(null);

  }

  Control.createCanvas = () => {}

  // this method will the canvas element to the specified location
  Control.migrateCanvas = (parentNode) => {

    // checking parent exists and parent has not been modified by the client
    if(parentNode && !Params.modifiedParent){

      // setting global parent
      Container = parentNode;

      // migrating cavnas fragment into parent container
      Layers.Background.setParent(parentNode);
      Layers.Middle.setParent(parentNode);
      Layers.Foreground.setParent(parentNode);

      // force resize
      Control.size();
    }

  }

  // fetches node from both given class or id
  Control.fetchNode = (identifier) => {
    return (document.getElementById(identifier) ||  document.getElementsByClassName(identifier)[0] || false)
  }

  // user specifying canvas container
  Control.parent = (parentName) => {

    // storing parent container node
    var parentNode = Control.fetchNode(parentName);

    // checking parent exists
    if(parentNode){

      // setting global parent
      Container = parentNode;

      // inserting canvas inside given parent
      Layers.Background.setParent(parentNode);
      Layers.Middle.setParent(parentNode);
      Layers.Foreground.setParent(parentNode);

      // setting param flag
      Params.modifiedParent = true;

    } else {
      console.error(`Parent container ${parentName} does not exist!`);
    }

  }

  // sets initial size of canvas
  Control.size = () => {

    if(Params.fullscreen){

      // setting global size variables
      // ( background used because all canvas's are assumed to be the same)
      width  = Container.clientWidth;
      height = Container.clientHeight;

    } else {

      // setting global size variables
      width  = Params.fixedsize.x;
      height = Params.fixedsize.y;

    }

    // updating all layers
    for(var layer in Layers){
      Layers[layer].setSize(new Vector(width,height),Params.fullscreen)
    }

    // updating size of canvas layers
    // Background.setSize(new Vector(width,height),Params.fullscreen);
    // Middle.setSize(new Vector(width,height),Params.fullscreen);
    // Foreground.setSize(new Vector(width,height),Params.fullscreen);

  }

  Control.setSize = (size) => {
    Params.fullscreen = false;
    Params.fixedsize.set(size)
    Control.size();
  }

  Control.setFullScreen = () => {
    Params.fullscreen = true;
    Control.size();
  }

  // events

  var mouseMoveEvents = [];

  // mouse up event callback array
  var mouseUpEvents = []

  // mouse down event callback array
  var mouseDownEvents = [];

  // click event callback array
  var clickEvents = [];

  // windows resize callback
  var windowResizeEvents = [];

  function setUpEvents(){

    Container.onmousemove = (event) => {
      mouseMoveEvents.map((e,i,a) => e(event));
    }

    Container.onmouseup = (event) => {

      mouseUpEvents.map((e,i,a) => e(event));

      mouse.down = false;
      mouse.up   = true;

    }

    Container.onmousedown = (event) => {

      mouseDownEvents.map((e,i,a) => e(event));

      mouse.down = true;
      mouse.up   = false;

    }

    Container.onclick = (event) => {
      clickEvents.map((e,i,a) => e(event));
    }

    Container.onresize = (event) => {
      windowResizeEvents.map((e,i,a) => e(event));
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

  //
  Control.setResizeEvent = (callback) => {
    // push new callback to click events
    windowResizeEvents.push(callback);
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

    // running update hook
    Update.update(deltaTime);

    // calling draw method ( with user hook )
    Draw.draw();

    // time since last render
    lastRender = time;

    // requesting new frame
    window.requestAnimationFrame(Control.loop.bind(this));

  }

  Control.loopbeta = (time) => {

    // running update hook
    Update.update(time);

    // calling draw method ( with user hook )
    Draw.draw();

    // requesting new frame
    window.requestAnimationFrame(Control.loopbeta.bind(this));
  }

  // hook for running preload stuff
  var Preload = (callback) => {
    console.log("Nothing to Do");
  }

  // hook for running setup functions after grageo is completed loading
  var Setup = (callback) => {

    // checking if setup ran before user set it up
    if(callback === null){
      return;
    }

    // if callback specified and params specify library read, run the
    // callback immediatly
    if(Params.ready && typeof callback === 'function'){
      callback();
    } else {
      // setup method to be ran when grageo setup is fired ( when client code loads before libary ready )
      Setup = callback;
    }

  }

  // methods associated with update systems of loop
  var Update = {};

  // hook setter for update method
  Control.setUpdate = (callback) => {
    if(typeof callback === 'function')
      Update.userUpdate = callback;
  }

  Update.update = (d) => {

    // this hook is encapsulated in a library method to add
    // any upkeep methods if needed later on
    Update.userUpdate(d)

  }

  Update.userUpdate = (d) => {}

  // methods associated with drawing to a canvas
  var Draw = {}

  // hook setter for draw method
  Control.setDraw = (callback) => {
    if(typeof callback === 'function')
      Draw.draw = callback;
  }

  // draw method hook in
  Draw.draw = () => {

    Layers.Background.clear();
    Layers.Middle.clear();
    Layers.Foreground.clear();

    Layers.Middle.text(100,'Ariel','center',new Vector(width/2,height/2),'No Draw Hook In');

  }


  // Augmenting the utility library with stateful methods

  // this method returns a vector of the width and height of the canvas
  Utility.size = () => {
    return new Vector(width,height);
  }

  Utility.mouse = () => {
    return mouse;
  }

  Utility.mouseOld = () => {
    return mouseOld;
  }

  Utility.randomScreen = () => {
    return new Vector(Utility.random(0,Utility.size().x),Utility.random(0,Utility.size().y))
  }

  Utility.polarLine = (start,angle,radius) => {
    return new Vector(
      start.x + Math.cos(Utility.radian(angle)) * radius,
      start.y + Math.sin(Utility.radian(angle)) * radius
    );
  }

  // this.planets[i].pos.x = this.planets[i].distance*2 * cos(this.planets[i].angle) + this.pos.x;
  // this.planets[i].pos.y = this.planets[i].distance *   sin(this.planets[i].angle) + this.pos.y;


  // when page is ready
  window.onload = () => {
    // running initial setup
    Control.setup();
    // setting ready state
    Params.ready = true;
    // kicking off draw loop
    Control.loop(0);
    // Control.loopbeta(0);

  }

  return {

    //update and utility method exposition
    Update:Update,

    // library control methods
    Setup:Setup,
    Control:Control,

    // exported classes
    Utility:Utility,
    Vector:Vector,
    Colour:Colour,
    Entity:Entity,
    CanvasLayer:CanvasLayer,

    // canvas layer exposition
    Layers,

  }

}());


module.exports = grageo;
