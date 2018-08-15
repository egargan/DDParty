
// tictactoe server class
// const TicTacToe = require('./TicTacToe')

const Game = require('./Game');

// importing module enum for message types
const MessageType = require('../shared/message');

class gameController {

  constructor(id) {

    //
    this.id = id;

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

  }

  setup(){

    this.game.setup();

    // this method when called will initialise all the players of a game
    this.game.initialisePlayers(this.clients)

  }

  update(){

    this.pollClients(false)

    // updating game instance
    let updateBundle = this.game.update();

    // updating clients with current game state
    for(var client of this.clients){
      client.setTransmitHook(MessageType.UPDATE,updateBundle)
    }


  }

  // GAME ADMINISTRATION

  // polling existing clients for connectivity
  pollClients(force){

    // waiting for delay in time to occur
    if(force || Date.now() - this.pollLastCheck >= this.polldelay){

      //
      this.pollLastCheck = Date.now();

      //
      for(let ci = this.clients.length-1 ; ci > 0 ; ci--){

        // checking if client has disconnected
        if(!this.clients[ci].isConnected()){

          console.logDD('GAME CONT',`Client ${this.clients[ci].id} has left the game!`)

          // this.clients[ci].socket = null;
          // this.clients[ci] = null;
          // this.clients.splice(ci,1);

          this.destroy();

        }

      }

    }

  }

  setDeconstruction(callback){
    this.deconstruction = callback
  }

  addClient(client){
    this.clients.push(client)
  }

  destroy(){
    // console.log(`[ GAME ] : ${this.id} has Shutdown, migrating clients!`);

    console.logDD('GAME CONT',`${this.id} has Shutdown, migrating clients!`)


    this.dead = true;
    this.deconstruction(this,this.clients);
  }


  transmit(){

  }

}

module.exports = gameController;
