
var Client = require('./Client.js')

var gameController = require('./GameController.js')

class Lobby {

  constructor(roomSize) {

    // client id counter
    this.clientIndex = 0;

    // client pool
    this.clients = [];

    // game id counter
    this.roomIndex = 0;

    // game pool
    this.rooms = [];

    // required room size for game
    this.roomSize = roomSize;

    // poll delay in ms
    this.polldelay = 1000;

    // last time of poll check
    this.pollLastCheck = Date.now()

  }

  // UPDATING ALL GAME STATES

  update(delta){

    // checking all non-gaming clients for connectivity
    this.pollClients(false);

    // attempt to build room
    // this.buildRoom();

    // updating all game loop methods
    for(let gi = 0 ; gi < this.rooms.length ; gi++){

      let room = this.rooms[gi];

      room.update(delta);

      if(room.dead){
        console.logDD('LOBBY','Room Dead!')

        this.rooms.splice(gi,1);
      }

    }

  }

  // LOBBY ADMINISTRATION

  // polling existing clients for connectivity
  pollClients(force){

    // waiting for time delay for check to pass or if the force check
    // flag is true
    if(force || Date.now() - this.pollLastCheck >= this.polldelay){

      // updating last time since poll check
      this.pollLastCheck = Date.now();

      // iterating over clients
      for(let ci = this.clients.length-1 ; ci >= 0 ; ci--){

        // checking if client has disconnected
        if(!this.clients[ci].isConnected()){

          console.logDD('LOBBY',`Client ${this.clients[ci].id} has disconnected!`)

          // if disconnected splice out client from list of clients
          this.clients.splice(ci,1);
        }

      }

    }

  }

  // return room size ( defunct )
  getRoomSize(){
    return this.roomSize;
  }

  // set room size ( defunct )
  setRoomSize(roomSize){
    this.roomSize = roomSize;
  }

  // checking client already exists in the client pool ( for reconnecting clients )
  checkExists(socket){

    // iterating over client collection
    for(let client of this.clients){

      // checking if client exists and returning true if so
      if(client.compare(socket)) return true;

    }

    // otherwise return false;
    return false;
  }

  // this method is ran when a new screen object joins the server
  addScreen(socket){

    // incrementing room index;
    this.roomIndex++;

    // create new game Object
    let game = new gameController(this.roomIndex);

    // if game destroys itself run this callback
    game.setDeconstruction( (game,clients) => {

      // migrating remaining clients back to lobby
      for(let client of clients){
        // checking client is worth migrating
        if(client.isConnected()){
          // pushing client back into pool
          this.clients.push(client);
        }
      }

    });

    let key = this.checkRoomKey();

    // adding main screen connection to client
    game.addScreen(socket,key);

    console.logDD('LOBBY',`Creating Room - ${key}!`)

    // setting up lobby object
    game.setup();

    // adding room to room collection
    this.rooms.push(game);

  }

  generateRoomKey(){

    let key = '';

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var char = 0 ; char < 10 ; char++){
      key += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return key;

  }

  checkRoomKey(){

    let success = false;

    let key = 0;

    // repeat until successful
    while(!success){

      // success state;
      success = false;

      // generate key`
      key = this.generateRoomKey();

      // iterate over rooms
      for(var room of this.rooms){

        // if room key is equal to new key
        if(room.screen.getRoomKey() !== key)  success = true;

      }

      if(this.rooms.length === 0) success = true;

    }

    return key

  }

  addClient(socket){


    if(!this.checkExists(socket)){
      console.logDD('LOBBY','New Client Added to Lobby!');
      this.clients.push(new Client(this.clientIndex,socket))
      this.clientIndex++;
    } else {
      console.logDD('LOBBY','Client Already Exists!');
    }
  }

  canBuildRoom(){
    return this.clients.length >= this.roomSize;
  }

  buildRoom(){

    // checking number of active clients are enough to make game
    if(this.canBuildRoom()){

      // console.log("[ LOBBY ] : Creating New Game!");

      console.logDD('LOBBY','Creating New Game!')


      this.roomIndex++;

      // create new game Object
      let game = new gameController(this.roomIndex);

      // if game destroys itself run this callback
      game.setDeconstruction( (game,clients) => {

        // migrating remaining clients back to lobby
        for(let client of clients){
          if(client.isConnected()){
            this.clients.push(client);
          }
        }

      });

      // append clients to game object
      for(let spaces = 0 ; spaces < this.roomSize ; spaces++){
        game.addClient(this.clients.inward(spaces))
      }

      game.setup();

      this.rooms.push(game);

      // remove clients from lobby
      this.trimLobby();

    }
    return false;
  }

  // defunct at the momment
  trimLobby(){}

  // return the number of current clients
  size(){
    return this.clients.length;
  }

  // print out lobby clients
  show(){
    console.logDD('LOBBY',`Lobby Size: ${this.size()}`)
    for(let client of this.clients)
      console.logDD('LOBBY',`Client - ${client.ip}`)
  }

}

module.exports = Lobby;
