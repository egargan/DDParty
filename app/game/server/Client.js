
const MessageType = require('../shared/message')

// enum of various controls
const Control = require('../shared/Control');

// link to server utilities module
const ServerUtility = require('../../utilities')

class Client {

  constructor(id,socket) {

    // this id
    this.id = id;

    // a random key string for loose identifying clients
    this.idString = ServerUtility.generateKeyString(10);

    // the ip of the socket connection
    this.ip = socket.handshake.address;

    // flag to determine if client is in room
    this.inRoom = false;

    // the sock of the client
    this.socket = socket;

    // number of counted disconnected occurences
    this.dcAttempts = 0;

    // max number of permitted disconnections
    this.dcMax = 10;

    // collection of emit hooks
    this.hooks = {

    }

    // run reup
    this.setup();

  }

  getInRoom(){
    return this.inRoom;
  }

  getId(){
    return this.getIdString();
  }

  getIdString(){
    return this.idString;
  }

  setInRoom(inRoom){
    this.inRoom = inRoom;
  }

  setup(){

    // saving emit hook for disconnect event
    this.setEmitHook('disconnect',() => {
      this.disconnectClient();
    })

  }

  disconnectClient(){
    // console.logDD('CLIENT',`Client ${this.ip} disconnected.`);
  }

  setControlHook(hook,callback){

    // checking function is valid
    if(!ServerUtility.isFunc(callback)) return false;

    // checking control exists
    if(!Control.hasOwnProperty(hook)) return false;

    this.callbacks.key.push(callback);

    // storing hook locally
    this.hooks[hook] = callback;

    // validating and saving hook to callback
    this.saveEmitHook(hook,callback);

  }

  // hook in for receiving various emissions from the client
  setEmitHook(hook,callback){

    // console.logDD('CLIENT',`Hook : ${hook}, Created for : ${this.ip}!`);

    // checking hook or callback exist
    if(hook && callback !== null){

      // storing hook locally
      this.hooks[hook] = callback;

      // validating and saving hook to callback
      this.saveEmitHook(hook,callback);

    }

  }

  checkExistingHook(hook,callback){
    // deregistering hook incase its already in use
    if(this.socket.listeners(hook)){
      this.socket.removeAllListeners(hook);
    }

  }

  // actual addition of emit hook to socket
  saveEmitHook(hook,callback){

    // checking and unregistering duplicate hook
    this.checkExistingHook(hook,callback)

    // registering new hook
    this.socket.on(hook,(payload) => {
      callback(payload)
    });

  }

  // transmit to client
  transmit(type,payload){
    if(type && payload){
      this.socket.emit(type,payload);
    }
  }

  // this method should attempt to referesh the connection
  // but currently sends a test commuinication
  refreshSocket(socket){

    // replacing current socket reference with new one
    this.socket = socket || this.socket;

    // passing all hooks to new socket
    for(var hook in this.hooks){
      // re-establishing hook and callback
      this.saveEmitHook(hook,this.hooks[hook]);

    }

  }


  // method to test communication has occured
  testCom(){
    let h = ServerUtility.hashObj(this.socket)
    // console.log(`Client ${this.id} : Test Com With ${h}`)
    this.socket.emit('test',h)
  }

  isConnected(){

    // incrementing dc attempts if not connected or resetting if connected
    if(!this.socket.connected){
      this.dcAttempts=+1;
    } else {
      this.dcAttempts=0;
    }

    // this condition will allow a client to remain disconnected until a reconnect
    // max has been waited
    if(this.dcMax <= this.dcAttempts){
      this.disconnectClient();
      return this.socket.connected;
    }

    // assume all is good
    return true;


  }

  // this method takes a socket and compares if same as client
  // n.b this doesnt mean the socket object is the exact same!
  compare(socket){

    // comparing socket and client ip
    let same = this.ip === socket.handshake.address;

    // if IP is the same refresh socked instead of reinstantiating
    if(same){
      this.refreshSocket(socket);
    }

    // returning answer
    return same;

  }

}

module.exports = Client;
