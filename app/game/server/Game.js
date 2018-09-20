
// this class acts as a base object for any game running on the server handling
// all generic activities a game may need to have to operate correctly

const MessageType = require('../shared/message')

const Vector = require('../grageo/vector');

const Utility = require('../grageo/utility');

const Controller = require('./Controller');

class Game {

  constructor() {

    this.bundle = null;

    this.playerCount = 0;

    // type of game, this is used for client side
    // gui rendering
    this.type = 'default'

    // list of player controlled objects
    this.players = [];

    // size of screen client display surface
    this.screenDimensions = new Vector(0,0)

  }

  // setup method
  setup(){

    console.logDD('GAME','Game Setup!');

    this.bundle = {
      tick:0,
      players:0
    }

  }

  getType(){
    return this.type;
  }

  // getter for game bundle
  getBundle(){
    return this.bundle;
  }

  getScreenDimensions(){
    return this.screenDimensions;
  }

  // setter for game bundle
  setBundle(bundle){
    this.bundle = bundle;
  }

  setType(type){
    this.type = type;
  }

  setScreenDimensions(screenDimensions){
    this.screenDimensions = screenDimensions
  }

  randomScreenPosition(){
    return new Vector(
      Utility.random(0,this.screenDimensions.x),
      Utility.random(0,this.screenDimensions.y)
    );
  }

  middleScreenPosition(){
    return new Vector(
      this.screenDimensions.x * 0.5,
      this.screenDimensions.y * 0.5
    )
  }

  resolveOffScreen(position){

  }

  offScreen(position){
    
    if( position.x < 0 ||
        position.x > this.screenDimensions.x ||
        position.y < 0 ||
        position.y > this.screenDimensions.y ){
          return true;
    }

    return false;
  }

  initialisePlayer(client){

    // creating new player orb
    let player = new PlayerOrb(
      // player socket
      client,
      // random size of orb
      Utility.randomInt(30,60),
      // new random position of orb
      new Vector(
        Utility.randomInt(0,this.screenDimensions.x),
        Utility.randomInt(0,this.screenDimensions.y)
      )
    );

    // seting up player object
    player.setup()

    // adding player object to collection
    this.players.push(player)

    // incremting bundle
    this.bundle.players += 1;

  }

  reinitialisePlayer(client){

  }

  // setup initial players involving anything game related
  initialisePlayers(clients){

    // setting local games player count;
    this.playerCount = clients.length;

    // iterating over client array
    for(var client of clients){

      // transmitting setup bundle to client
      client.transmit(MessageType.INIT,this.getBundle());

    }

  }

  // this method updates all the players and subsequently rebundles them
  updatePlayers(deltaTime){

    this.bundle.players = {};

    this.bundle.playerCount = this.players.length;

    for(var player of this.players){

      player.update(deltaTime);

      this.bundle.players[player.getId()] = {
        pos  : player.getPos(),
        size : player.getSize()
      }

    }

  }

  update(deltaTime){

    this.bundle.tick++;

    this.updatePlayers(deltaTime);

    return this.getBundle();

  }

}

class PlayerOrb {

  constructor(client,size,pos){

    this.client = client;

    this.size = size;

    this.pos = new Vector().set(pos)

    this.speed = 30;

  }

  setup(){

    this.client.setEmitHook(MessageType.CONTROL,(bundle) => {

      switch (bundle) {
        case 'left':   this.pos.x -= this.speed; break;
        case 'right':  this.pos.x += this.speed; break;
        case 'thrust': this.pos.y -= this.speed; break;
        case 'fire':   this.pos.y += this.speed; break;
        default:
      }
    })

  }

  getPos(){
    return this.pos;
  }

  getSize(){
    return this.size;
  }

  update(){}

}

module.exports = Game;
