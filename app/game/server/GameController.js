
// generic game class
const Game = require('./Game');

// class responsible for storing screen details
const Screen = require('./Screen');

// importing module enum for message types
const MessageType = require('../shared/message');

// client collection object
const ClientCollection = require('./ClientCollection');

class GameController {

  constructor(id) {

    //
    this.id = id;

    this.roomKey = '';

    // socket connection for screen
    this.screen = null;

    //
    this.clients = [];

    this._clients = new ClientCollection();

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

  }

  update(){

    // poll both clients and the screen for connectivity
    this.pollClients(false)

    // updating game instance
    let updateBundle = this.game.update();

    this.screen.transmit(MessageType.UPDATE,updateBundle)
    
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

      // iterating checking connections status by mapping over client
      // collection
      this._clients.map((client) => {
        // checking if client is connected
        if(!client.isConnected()){
          console.logDD('LOBBY',`Client ${client.id} has disconnected!`)
          // if client disconnected currently it does nothing as the server
          // is not dependent on the
          // this._clients.remove(client.ip)
        }
      })

      // //
      // for(let ci = this.clients.length-1 ; ci > 0 ; ci--){
      //
      //   // checking if client has disconnected
      //   if(!this.clients[ci].isConnected()){
      //
      //     console.logDD('GAME CONT',`Client ${this.clients[ci].id} has left the game!`)
      //
      //     // currently it does nothing as the server is not dependent on the
      //     // clients existing
      //
      //   }
      //
      // }

    }

  }

  // set room destruction callback
  setDeconstruction(callback){
    this.deconstruction = callback
  }

  addScreen(socket,key){

    this.screen = new Screen(0,socket,key);

    this.screen.setup();

    // setting emit hook for when screen client sends initial bundle
    this.screen.setEmitHook(MessageType.INIT,(bundle) => {

      // setting game screen size based off init bundle
      this.game.setScreenDimensions(bundle.screen)
    })

    // when screen changes, a message will be sent with the new coordinates
    this.screen.setEmitHook(MessageType.SCREENSIZE,(size)=>{

      console.logDD('GAME CONT',size);

      // when screen size is updated
      this.game.setScreenDimensions(size)

    })

    // when the screen leaves destroy game
    this.screen.setEmitHook('disconnect',() => {
      this.destroy()
    });

  }

  // the lobby handles client migration, this method is now just to
  // perform any further setup to the clients
  joinRoom(client){

    // adding client to this room
    this._clients.add(client.ip,client);

    // informing client of game type
    client.transmit(MessageType.GAMETYPE,this.game.getType());

    // inform screen a new player has joined
    this.screen.transmit(MessageType.PLAYERJOINEDLOBBY,'newclient');

    // linking control system to game object
    this.game.initialisePlayer(client);

  }

  // this is ran when a client reconnects to the room
  rejoinRoom(client){

    // informing client of game type
    client.transmit(MessageType.GAMETYPE,this.game.getType());

    // linking control system to game object
    // this.game.initialisePlayer(client);

    // inform screen a new player has joined
    // this.screen.transmit(MessageType.PLAYERJOINEDLOBBY,'newclient');


  }

  destroy(){
    console.logDD('GAME CONT',`Room : ${this.roomKey}, has Shutdown, migrating clients!`)
    this.dead = true;
    // running desconstruction callback passing in room and room client collection
    this.deconstruction(this,this._clients);
  }


  transmit(){

  }

}

module.exports = GameController;
