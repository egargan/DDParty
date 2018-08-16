
var Client = require('./Client.js')

var gameController = require('./GameController.js')

var MessageType = require('../shared/message')

var Util = require('../../utilities')

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

    // currently active room codes
    this.roomCodes = new Map();

    // required room size for game
    this.roomSize = roomSize;

    // poll delay in ms
    this.polldelay = 1000;

    // last time of poll check
    this.pollLastCheck = Date.now()

  }

  // return room size ( defunct )
  getRoomSize(){
    return this.roomSize;
  }

  // set room size ( defunct )
  setRoomSize(roomSize){
    this.roomSize = roomSize;
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

        let client = this.clients[ci];

        // checking if client has disconnected and isnt in a lobby
        // as the lobby is no longer administrating this object
        if(!client.isConnected()){

          console.logDD('LOBBY',`Client ${this.clients[ci].id} has disconnected!`)

          // if disconnected splice out client from list of clients
          this.clients.splice(ci,1);
        }

      }

    }

  }


  // checking client already exists in the client pool ( for reconnecting clients )
  checkExists(socket){

    // iterating over client collection
    for(let client of this.clients){

      // checking if client exists and returning true if so
      if(client.compare(socket)) return client;

    }

    // searching other rooms too
    for(let room of this.rooms){
      // searching each client of each subroom
      for(let client of room.clients){
        // checking if client exists and returning true if so
        if(client.compare(socket)) return client;
      }
    }

    // otherwise return false;
    return false;
  }

  // Checks through all currently created rooms and checks if
  // the key already exists
  // Returns false if no room with the key was found, else the room with the
  // same key is returned
  checkIsExistingKey(key) {

    // Loops through all active rooms
    for(let room of this.rooms) {

      // Checks their key against the new key
      if (room.screen.getRoomKey() === key) {

        // The keys match meaning it already exists
        return room;
      }

    }

    // No room is currently using the same key
    return false;

  }

  // this room will attempt to find the room a client belongs to
  checkExistingClientRoom(client){

    // Loops through all active rooms
    for(let room of this.rooms) {
      // loops through all the clients of this room
      for(let c of room.clients){
        if(c.compare(client.socket)) return room;
      }
    }

    return false;
  }

  // this method is ran when a new screen object joins the server
  addScreen(socket){

    // incrementing room index;
    this.roomIndex++;


    // create new game Object
    let game = new gameController(this.roomIndex);

    // generating random room key
    let key = this.generateRoomKey();

    // adding room key to room object
    game.addScreen(socket,key);

    // if game destroys itself run this callback
    game.setDeconstruction( (game,clients) => {

      // migrating remaining clients back to lobby
      for(let client of clients){
        // checking client is worth migrating
        if(client.isConnected()){

          // resetting client side UI
          client.transmit(MessageType.KICKPLAYER,1);

          // pushing client back into pool
          this.clients.push(client);
        }
      }

    });

    console.logDD('LOBBY',`Creating Room - ${key}!`)

    // adding room to room collection
    this.rooms.push(game);

  }

  // Generates a unique room code
  generateRoomKey(){

    let key;

    do {
      // Generate a new room code
      key = Util.generateKeyString(5);

      // If the room code contains any banned words or is
      // already in use, regenerate a new code
    } while (this.checkIsInDictionary(key) || this.checkIsExistingKey(key));

    return key;
  }

  // Checks the given key to see if it contains any banned phrases
  // Returns true if a banned word has been found in the key, else false
  checkIsInDictionary(key) {
    // List of words that should not be contained within the key
    const bannedPhrases = [
      'ASS',
      'ARSE',
      'BITCH',
      'CUNT',
      'FUCK',
      'JESUS',
      'NIGGA',
      'RAPE',
      'SHIT',
      'TWAT'
    ]

    // Goes through the list of banned phrases and sees if the key
    // contains any of them
    for (let word of bannedPhrases) {
      if (key.includes(word)) {
        // If the key does include a banned word, returns true
        return true;
      }
    }

    // If no words were found
    return false;
  }




  addClient(socket){

    let client = this.checkExists(socket)

    if(client){

      // room the key potentially belongs to
      let room = this.checkExistingClientRoom(client)

      if(room) {

        console.logDD('LOBBY',`Existing Client Rejoined Room ${room.roomKey}!`);
        client.refreshSocket(socket);
        room.rejoinRoom(client);
        return

      } else {
        // console.logDD("LOBBY",'Client Entered Wrong Room');
        // client.transmit(MessageType.WARNING,'Room Does Not Exist!')
        // allow new client to be established
        client = false;
      }

    }

    if(!client){

      console.logDD('LOBBY','New Client Added to Lobby!');

      client = new Client(this.clientIndex,socket);

      this.clients.push(client)

      this.clientIndex++;

      // attempt sending of roomkey
      client.setEmitHook(MessageType.ROOMKEYINPUT,(key) => {

        // room the key potentially belongs to
        let room = this.checkIsExistingKey(key)

        // adding client to room
        if(room) {

          // iterating over all connected clients in lobby
          for(var c = this.clients.length-1 ; c >= 0 ; c-- ){

            // checking if current element is the client being added
            if(this.clients[c] === client){

              console.logDD('LOBBY',`Client ${client.getIdString()} Joined Room ${key}`);

              // splicing client out of lobby pool and adding to room pool
              room.joinRoom(this.clients[c]);

              this.clients.splice(c,1);

            }

          }

        } else {

          console.logDD("LOBBY",'Client Entered Wrong Room');
          client.transmit(MessageType.WARNING,'Room Does Not Exist!')

        }

      })

    }

  }

  canBuildRoom(){
    return this.clients.length >= this.roomSize;
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


// buildRoom(){
//
//   // checking number of active clients are enough to make game
//   if(this.canBuildRoom()){
//
//     // console.log("[ LOBBY ] : Creating New Game!");
//
//     console.logDD('LOBBY','Creating New Game!')
//
//
//     this.roomIndex++;
//
//     // create new game Object
//     let game = new gameController(this.roomIndex);
//
//     // if game destroys itself run this callback
//     game.setDeconstruction( (game,clients) => {
//
//       // migrating remaining clients back to lobby
//       for(let client of clients){
//         if(client.isConnected()){
//           this.clients.push(client);
//         }
//       }
//
//     });
//
//     // append clients to game object
//     for(let spaces = 0 ; spaces < this.roomSize ; spaces++){
//       game.addClient(this.clients.inward(spaces))
//     }
//
//     game.setup();
//
//     this.rooms.push(game);
//
//     // remove clients from lobby
//     this.trimLobby();
//
//   }
//   return false;
// }
