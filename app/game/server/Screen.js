
var Client = require('./Client')

var MessageType = require('../shared/message')

class Screen extends Client {

  constructor(id,socket,key) {
    super(id,socket);

    this.roomKey = key;

  }

  getRoomKey(){
    return this.roomKey;
  }

  setRoomKey(key){
    this.roomKey = key;
  }

  setup(){

    // this.socket.on('disconnect',() => {
    //
    //  //check if socket.id is associated to any account in the db
    //  // if true : remove the socket.id and set as account status : offline
    //  this.disconnectScreen();
    //
    // });

    // transmitting setup bundle to client
    this.transmit(MessageType.ROOMKEY,this.roomKey);


  }

  disconnectClient(){
    console.logDD('SCREEN',`Screen ${this.ip} - ${this.roomKey} disconnected.`);
  }

  // hook in for receiving various emissions from the client
  setEmitHook(hook,callback){

    console.logDD('SCREEN',`Hook ${hook}, Created for ${this.ip}!`);

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

}

module.exports = Screen;
