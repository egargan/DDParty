
class Game {

  constructor() {

    this.bundle = null;

    this.playerCount = 0;

  }

  // getter for game bundle
  getBundle(){
    return this.bundle;
  }

  // setter for game bundle
  setBundle(bundle){
    this.bundle = bundle;
  }

  // setup method
  setup(){

  }

  // setup initial players passing in array of clients
  initialisePlayers(clients){

    console.log("Sending Client Setup Bundle");

    // setting local games player count;
    this.playerCount = clients.length;

    // player incrementing
    let playerIndex = 0;

    let bundle = this.getBundle();

    for(var client of clients){

      // incrementing player
      bundle.player = ++playerIndex;

      // transmitting setup bundle to client
      client.transmit(MessageType.INIT,bundle);

    }


  }




}
