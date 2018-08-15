
// this class acts as a base object for any game running on the server handling
// all generic activities a game may need to have to operate correctly

const MessageType = require('../shared/message')

class Game {

  constructor() {
    this.bundle = null;
    this.playerCount = 0;
  }

  // getter for game bundle
  getBundle(){
    return this.bundle;
  }

  // setter for game bundle
  setBundle(bundle){
    this.bundle = bundle;
  }

  // setup method
  setup(){

    console.logDD('GAME','Game Setup!');

    this.bundle = {
      tick:0
    }

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

module.exports = Game;
