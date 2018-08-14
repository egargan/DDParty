
class Loop {

  constructor(sps,fps,updateCallback,drawCallback){

      console.log(" > GAME LOOP Started. ");

      // this value represents the number of phsical updates per second
      this.sps = 1000 / sps;

      // fps as a value over 1 second ( 1000 miliseconds / '30' fps ) = 33.3 ms before next tick
      this.fps = 1000.0 / fps;

      // variable to store time of current tick
      this.now = this.getNow();

      // variable to store time of last tick
      this.lastTimeS = this.getNow();

      this.lastTime = this.getNow();

      // call back to run on tick fire
      this.updateCallback = updateCallback;
      this.drawCallback = drawCallback;

      // tick total
      this.totalTick = 0;

      this.totalFrames = 0;

      this.deltaTime = 0;

      this.ticking = true;

      // this.tick();

      // new game loop

      this.tickSecond = 0;

      this.lastRender = 0;

      this.lastSecond = this.getNow();

      this.currentFPS = 0;

      window.requestAnimationFrame(this.tick_2.bind(this))

  }

  tick_2(time){

    // incrementing ticks
    this.totalTick++;
    // incrementing ticks since last second
    this.tickSecond++;

    // if the current time minus the time since the last frame poll is more than a second
    if(time - this.lastSecond > 1000){

      this.currentFPS = this.tickSecond;

      // reset ticks per second
      this.tickSecond = 0;

      // update last second time
      this.lastSecond = time;

    }

    // update fps diagnostic and chart
    diagnostic.updateLine("FPS: ",this.currentFPS);
    chart.addSample(this.currentFPS);

    let deltaTime = ((time - this.lastRender) / this.fps);

    let progress = (Math.round(deltaTime * 10000) / 10000);

    this.updateCallback(progress);
    this.drawCallback();

    this.lastRender = time;

    // diagnostic.updateLine("Prog-1: ",Math.round(((time - this.lastRender) / this.fps) * 100) / 100);
    diagnostic.updateLine("Prog-2: ",progress);

    // requesting new frame
    window.requestAnimationFrame(this.tick_2.bind(this));

  }

  tick(){

    // requesting next frame
    window.requestAnimationFrame(this.tick.bind(this));

    this.totalTick++;

    // getting current time
    this.now = Date.now();

    // setting delta as current time minus previous time in seconds
    this.deltaTime = this.now - this.lastTime;

    // checking if delta time is greater then fps requirement
    if(this.deltaTime > this.sps){

      this.lastTime = this.now - (this.deltaTime % this.sps);

      // if(this.totalTick % 120 === 0)
      //   console.log("FRAME: " + this.deltaTime);

      // setting previous tick to the current tick time
      diagnostic.updateLine("------- SPS",Math.floor(1000.0 / this.sps));
      diagnostic.updateLine("Current SPS",Math.floor(1000.0 / this.deltaTime));
      diagnostic.updateLine("Total Frame",this.totalTick);

      // running callback with delta time
      //   calling return call back with new delta time
        // if(typeof this.callBack == "function") {}

      diagnostic.updateLine("deltaTime",this.deltaTime);


      this.updateCallback( ( this.deltaTime / 10 < 30 ? this.deltaTime / 10 : 30 ) );

    }

    if(this.deltaTime > this.fps){

      this.drawCallback();

      chart.addSample(1000.0 / this.deltaTime)

      diagnostic.updateLine("------- FPS",Math.floor(1000.0 / this.fps));
      diagnostic.updateLine("Current FPS",Math.floor(1000.0 / this.deltaTime));
    }

}

  getNow(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

}

module.exports = Loop;
