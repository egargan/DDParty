
var Client = require('./Client')

var MessageType = require('../shared/message')

const Vector = require('../grageo/vector');

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

    // transmitting setup bundle to client
    this.transmit(MessageType.ROOMKEY,this.roomKey);
    
  }

  disconnectClient(){
    console.logDD('SCREEN',`Screen ${this.ip} - ${this.roomKey} disconnected.`);
  }

}

module.exports = Screen;
