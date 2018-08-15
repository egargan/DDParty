
var Util = require('../../utilities.js');

class Client {

  constructor(id,socket) {

    // this id
    this.id = id;

    // the ip of the socket connection
    this.ip = socket.handshake.address;

    // the sock of the client
    this.socket = socket;

    // number of counted disconnected occurences
    this.dcAttempts = 0;

    // max number of permitted disconnections
    this.dcMax = 10;

    // run reup
    this.setup();

  }

  setup(){

    this.socket.on('disconnect',() => {

     //check if socket.id is associated to any account in the db
     // if true : remove the socket.id and set as account status : offline
     console.log(`Client ${this.ip} - Disconnected! `);

    });
  }


  // hook in for receiving various emissions from the client
  setEmitHook(hook,callback){

    console.log(`Hook ${hook}, Created for ${this.ip}!`);

    if(hook && callback){

      // deregistering hook incase its already in use
      if(this.socket.listeners(hook))
        this.socket.removeListener(hook,callback);

      // registering new hook
      this.socket.on(hook,(payload) => {
        callback(payload)
      });

    }

  }

  // transmit to client
  transmit(type,payload){
    if(type && payload){
      this.socket.emit(type,payload);
    }
  }

  // hook in for transmitting data back to client
  setTransmitHook(hook,payload){
    if(hook && payload){
      this.socket.emit(hook,payload);
    }
  }

  refreshSocket(socket){

    this.socket = socket || this.socket;

    this.testCom();

  }


  // method to test communication has occured
  testCom(){
    let h = Util.hashObj(this.socket)
    // console.log(`Client ${this.id} : Test Com With ${h}`)
    this.socket.emit('test',h)
  }

  isConnected(){

    // incrementing dc attempts if not connected or resetting if connected
    this.dcAttempts = !this.socket.connected ? this.dcAttempts+1 : 0;

    // this condition will allow client to remain disconnected until a reconnect
    // max has been waited
    if(this.dcMax <= this.dcAttempts){
      console.log(`[ CLIENT ] : Client ${this.ip} disconnected.`);
      return this.socket.connected;
    } else {
      return true;
    }

  }

}

module.exports = Client;
