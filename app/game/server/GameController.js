
// generic game class
const Game = require('./Game');

// class responsible for storing screen details
const Screen = require('./Screen');

// importing module enum for message types
const MessageType = require('../shared/message');

class gameController {

  constructor(id) {

    //
    this.id = id;

    // socket connection for screen
    this.screen = null;

    //
    this.clients = [];

    //
    this.dead = false;

    // poll delay in ms
    this.polldelay = 500;

    // last time of poll check
    this.pollLastCheck = Date.now()

    // setting up game
    this.game = new Game()

    // setting up game object
    this.game.setup();

  }

  setup(){

    // this method when called will initialise all the players of a game
    this.game.initialisePlayers(this.clients)

  }

  update(){

    // poll both clients and the screen for connectivity
    this.pollClients(false)

    // updating game instance
    let updateBundle = this.game.update();

    // updating clients with current game state
    for(var client of this.clients){
      client.transmit(MessageType.UPDATE,updateBundle)
    }

  }

  // GAME ADMINISTRATION

  // polling existing clients for connectivity
  pollClients(force){

    // waiting for delay in time to occur
    if(force || Date.now() - this.pollLastCheck >= this.polldelay){

      //
      this.pollLastCheck = Date.now();

      // checking if screen is still connected, if not destroy room
      if(!this.screen.isConnected()){
        this.destroy();
        return;
      }

      //
      for(let ci = this.clients.length-1 ; ci > 0 ; ci--){

        // checking if client has disconnected
        if(!this.clients[ci].isConnected()){
          console.logDD('GAME CONT',`Client ${this.clients[ci].id} has left the game!`)
          this.destroy();
        }

      }

    }

  }

  setDeconstruction(callback){
    this.deconstruction = callback
  }

  addScreen(socket,key){
    this.screen = new Screen(0,socket,key);
    this.screen.setup();
  }

  addClient(client){

    this.clients.push(client)

    client.transmit(
      MessageType.GAMETYPE,
      this.game.getType()
    );

  }

  destroy(){
    // console.log(`[ GAME ] : ${this.id} has Shutdown, migrating clients!`);

    console.logDD('GAME CONT',`${this.roomKey} has Shutdown, migrating clients!`)


    this.dead = true;
    this.deconstruction(this,this.clients);
  }


  transmit(){

  }

}

module.exports = gameController;
