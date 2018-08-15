
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

  update(){

    // checking all non-gaming clients for connectivity
    this.pollClients(false);

    // attempt to build room
    this.buildRoom();

    // updating all game loop methods
    for(let gi = 0 ; gi < this.rooms.length ; gi++){
      let room = this.rooms[gi];

      room.update();

      if(room.dead){
        console.logDD('LOBBY','Room Dead!')


        this.rooms.splice(gi,1);
      }

    }



  }

  // LOBBY ADMINISTRATION

  // polling existing clients for connectivity
  pollClients(force){

    // waiting for delay in time to occur
    if(force || Date.now() - this.pollLastCheck >= this.polldelay){

      this.pollLastCheck = Date.now();

      for(let ci = 0 ; ci < this.clients.length ; ci++){
        // checking if client has disconnected
        if(!this.clients[ci].isConnected()){
          console.logDD('LOBBY',`Client ${this.clients[ci].id} has disconnected!`)


          this.clients.splice(ci,1);
        }

      }

    }

  }

  getRoomSize(){
    return this.roomSize;
  }

  setRoomSize(roomSize){
    this.roomSize = roomSize;
  }

  // checking client already exists in the client pool ( for reconnecting clients )
  checkExists(socket){

    for(let client of this.clients){

      if(client.ip === socket.handshake.address){

        // refresh socket for connection purposes
        client.refreshSocket(socket);
        // return found
        return true;

      }

    }
    // return false;
    return false;
  }

  addClient(socket){
    if(!this.checkExists(socket)){
      this.clients.push(new Client(this.clientIndex,socket))
      this.clientIndex++;
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

  trimLobby(){
    // trimming back of lobby array
    // this.clients.inwardSplice(0,2)
    this.clients.splice(this.clients.length-1,1);
    this.clients.splice(this.clients.length-1,1);

  }


  size(){
    return this.clients.length;
  }

  show(){

    console.logDD('LOBBY',`Lobby Size: ${this.size()}`)


    for(let client of this.clients)
      console.logDD('LOBBY',`Client - ${client.ip}`)

  }

}

module.exports = Lobby;
