
// require library
const Grageo = require('./grageo');

// drawing library
const Draw = Grageo.Draw;

// drawing library
const Util = Grageo.Util;

// drawing library
const Control = Grageo.Control;

// vector class
const V = require('../lib/vector');

// colour class
const Colour = require('../lib/colour');

var backgroundColour = new Colour(240,240,240,1);

class TicTacToe {

  constructor() {

    this.board = [];

    this.tilesize = 200;

    this.margin = 10;

    this.dimension = new V(0,0);

    this.player = 0;

    this.boardClickHook = null;

  }

  setup(bundle){

    console.log(bundle);

    this.dimension = new V(bundle.dimension.x,bundle.dimension.y);

    this.player = bundle.player;

    // initialising tile board
    for(let y = 0 ; y < this.dimension.y ; y++){
      let row = []
      for(let x = 0 ; x < this.dimension.x ; x++){
        row.push(new Tile(
          this.tilesize,
          (this.player === 1 ? TileType.NOUGHT : TileType.CROSS),
          new V(x,y)
        ));
        row[x].setClickHook(this.tileClickHook.bind(this));
      }
      this.board.push(row);
    }
  }

  // this method iterates over all tiles, returning the tile at each point
  // allowing for a custom interaction with each iterated tile
  map(callback){
    // traversing the rows of the board
    for(let y = 0 ; y < this.dimension.y ; y++){
      // traversing the columns of the board
      for(let x = 0 ; x < this.dimension.x ; x++){
        // fetching tile at that position
        let tile = this.board[y][x];
        // performing callback
        callback(tile,x,y);
      }
    }
  }

  // similar to the map method but this takes an array of callbacks applying
  // them in sequence rather then needing to recall map
  mapArray(callbacks){

    // iterating over tiles
    this.map((tile,x,y) => {
      for(var callback of callbacks)
        callback(tile,x,y);
    })

  }

  positionTiles(){

    // calculating the size of the board including the margins
    let dimension = new V(
      this.dimension.x*(this.tilesize+(this.margin*0.5)),
      this.dimension.y*(this.tilesize+(this.margin*0.5))
    )

    // start position of board drawing
    let start = new V(
      Util.middle().x-(dimension.x/2),
      Util.middle().y-(dimension.y/2)
    );

    // iterating over all the board tiles applying this function
    this.map((tile,x,y) => {

      // setting the relative position from the center of the screen
      tile.updatePos(new V(
        start.x+(x*(this.tilesize+(this.margin*0.75))),
        start.y+(y*(this.tilesize+(this.margin*0.75)))
      ))

    })

  }

  // setter for board click hook callback
  setBoardClickHook(hook){
    this.boardClickHook = hook;
  }

  // method fired when tile hook is called
  tileClickHook(position){

    console.log(` Board Clicked @ ${position.toString()}`);

    // attempt firing click hook
    if(this.boardClickHook) this.boardClickHook(position);

  }

  checkClickedTile(callback){

    // iterating over tiles
    this.map((tile,x,y) => {
      if(tile.hovering)
        callback(true,new V(x,y));
    })

  }


  update(bundle){

    if(bundle){

      this.positionTiles()

      if(this.margin > 100){
        this.margin = 0;
      }

      this.map((tile,x,y) => {
        tile.update();
        tile.setState(bundle.board[y][x]);
      })

    }

  }

  draw(){

    if(this.board.length > 0){

      // filling canvas background
      Draw.background(backgroundColour);

      this.map((tile,x,y) => {
        tile.draw();
      });

      // // calculating the size of the board including the margins
      // let dimension = new V(
      //   this.dimension.x*(this.tilesize+(this.margin*0.5)),
      //   this.dimension.y*(this.tilesize+(this.margin*0.5))
      // )
      //
      // // start position of board drawing
      // let start = new V(
      //   Util.middle().x-(dimension.x/2),
      //   Util.middle().y-(dimension.y/2)
      // );
      //
      // // start position of board drawing
      // let end = new V(
      //   Util.middle().x+(dimension.x/2),
      //   Util.middle().y+(dimension.y/2)
      // );
      //
      // Draw.fillCol(new Colour(200,0,0))
      // Draw.circle(start,20)
      //
      // Draw.fillCol(new Colour(200,0,0))
      // Draw.circle(end,20)
      //
      // Draw.fillCol(new Colour(200,0,0))
      // Draw.circle(Util.middle(),40)

    }

  }

}

var TileType = {
  CROSS:'cross',
  NOUGHT:'nought'
}

class Tile {

  constructor(tilesize,tiletype,boardPos) {

    // edge position
    this.pos = new V(0,0,0);

    // center of tile
    this.center = new V(0,0,0);

    // size of tile
    this.tilesize = tilesize;

    // enum type of tile when player uses it
    this.tiletype = tiletype;

    // vector of tile position on board
    this.boardPos = new V(boardPos.x,boardPos.y)

    // padding of tile
    this.padding = 10;

    // mouse hovering tile
    this.hovering = false;

    // mouse clicking within tile
    this.clicking = false;

    // mouse has been clicked within tile
    this.clicked  = false;

    this.clickHook = null;

    // state of current tile
    this.state = 0;

  }

  setClickHook(hook){
    this.clickHook = hook;
  }

  setState(state){
    this.state = state;
  }

  updatePos(pos){

    this.pos.set(pos);

    this.center.x = pos.x + this.tilesize/2
    this.center.y = pos.y + this.tilesize/2

  }

  mouseInside(){

    return Util.mouse().x > this.pos.x &&
           Util.mouse().x < this.pos.x + this.tilesize &&
           Util.mouse().y > this.pos.y &&
           Util.mouse().y < this.pos.y + this.tilesize;

  }

  // checking if mouse position is inside the tile
  checkMouseHover(){
    this.hovering = this.mouseInside();
  }

  // checking mouse clicked inside tile
  checkMouseClick(){

    // checking if mouse is inside tile
    if(this.mouseInside()){

      // checking if mouse is both down and also has not been accounted for
      if(Util.mouse().down && !this.clicking){
        // setting trap
        this.clicking = true;
        return this.clicking;
      }

      // checking for mouse release actual "click" event
      if(!Util.mouse().down && this.clicking){
        // resetting trap
        this.clicking = false;
        return this.clicking;
      }

    }

    return false;

  }

  update(){
    this.checkMouseHover();

    // if mouse clicked inside tile and click callback exits run callback
    if(this.checkMouseClick() && this.clickHook){
      // performing callback with board position vector for origin of click
      this.clickHook(this.boardPos);
      // console.log(`User Clicked On Tile - ${this.boardPos.toString()}`);
    }
  }

  drawEmpty(){

    // this.drawCross()
    // this.drawNought()

  }

  drawNought(hover){

    // Draw.fillCol(new Colour(200,100,100));
    Draw.arc(this.center,this.tilesize*0.35,0,2*Math.PI)

    if(hover){
      Draw.stroke(10,new Colour(200,100,100).getHex())
    } else {
      Draw.stroke(10,new Colour(200,100,100).getHex())
    }

  }

  drawCross(hover){

    let segment = this.tilesize*0.3;

    let colour = new Colour(200,100,100)

    if(hover){
        colour = new Colour(200,100,100);
    }


    let topleft = new V(
      this.center.x-segment,
      this.center.y-segment
    );

    let topright = new V(
      this.center.x+segment,
      this.center.y-segment
    );

    let botleft = new V(
      this.center.x-segment,
      this.center.y+segment
    );

    let botright = new V(
      this.center.x+segment,
      this.center.y+segment
    );

    Draw.line(
      topleft,botright,20,colour.getHex()
    );

    Draw.line(
      topright,botleft,20,colour.getHex()
    );

    Draw.fillCol(colour)
    Draw.circle(topleft,10)
    Draw.circle(topright,10)
    Draw.circle(botleft,10)
    Draw.circle(botright,10)

  }

  drawTile(){

    // board colour
    Draw.fillCol(new Colour(83, 92, 104))

    // hover state of mouse
    if(this.hovering){

      // checking if the tile is empty
      if(this.state === 0){
        Draw.fillCol(new Colour(186, 220, 88))
      }

      // checking if the tile is not empty
      if(this.state === 1 && this.state === 2){
        Draw.fillCol(new Colour(235, 77, 75))
      }

    }

    // drawing tile outline
    Draw.rect(this.pos,new V(this.tilesize,this.tilesize));

    // drawing transparency outline
    Draw.fillCol(backgroundColour);
    Draw.rect(
      new V(this.pos.x+this.padding,this.pos.y+this.padding),
      new V(this.tilesize-this.padding*2,this.tilesize-this.padding*2)
    );


  }

  drawOverlay(){

    // hover state of mouse
    if(this.hovering){

      // checking if the tile is empty
      if(this.state === 0){
        Draw.fillCol(new Colour(186, 220, 88))
      }

      // checking if the tile is not empty
      if(this.state === 1 && this.state === 2){
        Draw.fillCol(new Colour(235, 77, 75))
      }

    }

    if(this.hovering){
      switch (this.tiletype) {
        case TileType.CROSS : this.drawCross(true); break;
        case TileType.NOUGHT: this.drawNought(true); break;
        default:
      }
    }

  }

  draw(){

    this.drawTile();

    this.drawOverlay();

    switch (this.state) {
      case 0: break;
      case 1: this.drawCross(); break;
      case 2: this.drawNought(); break;
      default:

    }

  }

}

module.exports = TicTacToe;
