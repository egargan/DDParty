
// this class acts as a base object for any game running on the server handling
// all generic activities a game may need to have to operate correctly

const MessageType = require('../shared/message')

class Game {

  constructor() {

    this.bundle = null;

    this.playerCount = 0;

    this.type = 'asteroids'

    this.controllers = [];

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

  // setter for game bundle
  setBundle(bundle){
    this.bundle = bundle;
  }

  setType(type){
    this.type = type;
  }

  initialisePlayer(client){
    let controller = new Controller(client);
    controller.setup()
    this.controllers.push(controller)
    this.bundle.players += 1;
  }

  reinitialisePlayer(client){

  }

  // setup initial players involving anything game related
  initialisePlayers(clients){

    console.logDD('GAME','Sending Client Setup Bundle!');

    // setting local games player count;
    this.playerCount = clients.length;

    // iterating over client array
    for(var client of clients){

      // transmitting setup bundle to client
      client.transmit(MessageType.INIT,this.getBundle());

    }

  }

  update(){

    this.bundle.tick++;

    return this.getBundle();

  }

}

class Controller {

  constructor(socket) {
    this.client = socket;
  }

  setup(){
    this.client.setEmitHook(MessageType.CONTROL,(bundle) => {
      console.logDD('CONTROLLER',`Client ${this.client.getIdString()} Pressed : ${bundle}`);
    })
  }

  update(){}

}

module.exports = Game;
