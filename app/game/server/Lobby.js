
var Client = require('./Client.js')

var GameController = require('./GameController.js')

var MessageType = require('../shared/message')

// client collection object
var ClientCollection = require('./ClientCollection');

var Util = require('../../utilities')

class Lobby {

  constructor(roomSize) {

    // client id counter
    this.clientIndex = 0;

    // client pool
    this.clients = [];

    // test object
    this._clients = new ClientCollection();

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

    // iterating over rooms in collection
    for(let gi = 0 ; gi < this.rooms.length ; gi++){

      // fetching room
      let room = this.rooms[gi];

      // updating room
      room.update(delta);

      // checking if room is dead
      if(room.dead){
        console.logDD('LOBBY','Room Dead!')
        // splicing room out of circulation
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

      // iterating checking connections status by mapping over client
      // collection
      this._clients.map((client) => {
        // checking if client is connected
        if(!client.isConnected()){
          console.logDD('LOBBY',`Client ${client.id} has disconnected!`)
          // if disconnected splice out client from list of clients
          this._clients.remove(client.ip)
        }
      })

      // // iterating over clients
      // for(let ci = this.clients.length-1 ; ci >= 0 ; ci--){
      //   let client = this.clients[ci];
      //
      //   // checking if client has disconnected and isnt in a lobby
      //   // as the lobby is no longer administrating this object
      //   if(!client.isConnected()){
      //
      //     console.logDD('LOBBY',`Client ${this.clients[ci].id} has disconnected!`)
      //
      //     // if disconnected splice out client from list of clients
      //     this.clients.splice(ci,1);
      //   }
      // }

    }

  }


  // checking client already exists in the client pool ( for reconnecting clients )
  checkExists(socket){

    let ip = this.getIp(socket);

    let existingClient = null;

    // if client exists this will find it
    existingClient = this._clients.get(ip)

    // if superficial search found client
    if(existingClient){
      console.logDD('DEBUG',`Lobby Exists`);
      // return client
      return existingClient
    } else {
      // searching other rooms too
      for(let room of this.rooms){
        // searching rooms "client collection" object
        existingClient = room._clients.get(ip)
        // if found in this room return it
        if(existingClient){
          console.logDD('DEBUG',`Room Exists ${room.roomKey}`);
          return existingClient;
        }
      }

    }

    console.logDD('DEBUG',`Client New ${ip}`);

    // otherwise return null;
    return null;
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
    return null;

  }

  // this room will attempt to find the room a client belongs to
  checkExistingClientRoom(client){

    // Loops through all active rooms
    for(let room of this.rooms) {

      // if room contains this client
      if(room._clients.get(client.ip)) return room;

      // // loops through all the clients of this room
      // for(let c of room.clients){
      //   if(c.compare(client.socket)) return room;

      }

    return false;
  }

  addClient(socket){

    // check client exists somewhere within the lobby structure
    let client = this.checkExists(socket)

    // if client does exist
    if(client){

      // room the key potentially belongs to
      let room = this.checkExistingClientRoom(client)

      if(room) {

        console.logDD('LOBBY',`Existing Client Rejoined Room ${room.roomKey}!`);
        // attempt to reconnect all socket methods / hooks
        client.refreshSocket(socket);

        // place client back to room
        room.rejoinRoom(client);
        return

      } else {
        // console.logDD("LOBBY",'Client Entered Wrong Room');
        // client.transmit(MessageType.WARNING,'Room Does Not Exist!')

        // reset client guard variable to allow new client to be established
        client = false;
      }

    }

    // if client not found or simply forced by above code
    if(!client){

      console.logDD('LOBBY','New Client Added to Lobby!');

      // creating new client object
      client = new Client(this.clientIndex,socket);

      // adding new client to collection
      this._clients.add(client.ip,client)

      // this.clients.push(client)

      this.clientIndex++;

      // attempt sending of roomkey
      client.setEmitHook(MessageType.ROOMKEYINPUT,(key) => {
        this.joinRoom(client,key)
      })

    }

  }

  // this method is ran when a new screen object joins the server
  addScreen(socket){

    // incrementing room index;
    this.roomIndex++;

    // create new game Object
    let game = new GameController(this.roomIndex);

    // generating random room key
    let key = this.generateRoomKey();

    // adding room key to room object
    game.addScreen(socket,key);

    // if game destroys itself run this callback
    game.setDeconstruction( (room,clients) => {

      // migrating clients back to main collection assuming a condition
      // condition - are they still connected
      // then - if connected, transmit kick command to clients
      this._clients.migrateAllIf(clients,(c) => {
        return c.isConnected();
      // and if connected then send transmission message
      },(client) => {
        // resetting client side UI if still connected
        client.transmit(MessageType.KICKPLAYER,1);
      })

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

  // client entered room key, this method will determine if it was successful
  // or not and then decide what to do
  joinRoom(client,key){

    // room the key potentially belongs to
    let room = this.checkIsExistingKey(key)


    // adding client to room
    if(room) {

      // fetch client in lobby collection for validation it exists
      let joiningClient = this._clients. cut(client.ip)

      // if client cut ( aka found and now copied into the joining client variable )
      if(joiningClient){

        console.logDD('LOBBY',`Client ${client.getIdString()} Joined Room ${key}`);

        // migrating client from current lobby collection over to room
        // client collection that the room key belongs to.
        // room._clients.migrate(client.ip,this._clients);

        // running client setup in room
        room.joinRoom(joiningClient);

      }

    } else {

      console.logDD('LOBBY',`Client Entered Wrong Room : ${key}`);

      client.transmit(MessageType.WARNING,`Room '${key}' Does Not Exist!`);

    }


  }

  // defunct at the momment
  trimLobby(){}

  // return the number of current clients
  size(){
    return this._clients.size();
  }

  // print out lobby clients
  show(){
    console.logDD('LOBBY',`Lobby Size: ${this.size()}`)
    this._clients.showAll(ip);
  }

  getIp(socket){
    return socket.handshake.address
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
