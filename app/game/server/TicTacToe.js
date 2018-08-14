
const V = require('../lib/vector')

// importing module enum for message types
const MessageType = require('../shared/message');

class TicTacToe {

  constructor(size = 3) {

    this.size = size;

    this.dimension = new V(size,size);

    this.board = [];

    this.turn = 0;

    this.bundle = null;

    this.setup();

  }

  setup(){

    // identifying first mover
    this.turn = this.firstMove() ? 1 : 2;

    this.bundle = {
      turn:this.turn,
      dimension:this.dimension,
      board:this.board
    }

    // building dynamic board size;
    for(let y = 0 ; y < this.dimension.y ; y++){
      let row = [];
      for(let x = 0 ; x < this.dimension.x ; x++){
        row.push(0);
      }
      this.board.push(row)
    }


  }

  // method to determine the first move maker
  // if true ( player 1 ), false player 2
  firstMove(){
    return Math.random() > 0.5;
  }

  // checking if board position is available
  canSetPosition(pos){
    return this.board[pos.y][pos.x] === 0;
  }

  setPosition(pos,player){

    if(this.canSetPosition(pos)){

      // incrementing move counter
      this.moves++

      // applying change to board
      this.board[pos.y][pos.x] = player

      // switching current player
      this.turn = this.turn === 1 ? 2 : 1;

    }
  }

  value(x,y){
    return this.board[y][x]
  }

  // this method checks for any win states
  checkWinnerCount(p1,p2){
    if(p1 === this.dimension.x)
      return 1;

    if(p2 === this.dimension.x)
      return 2;

    return null;
  }

  // this method looks for winning board states
  won(){

    let player_1 = 0;
    let player_2 = 0;

    for(let y = 0 ; y < this.size ; y++){

      // checking sub elements
      for(let x = 0 ; x < this.size ; x++){

        let v = this.value(y,x)

        if(v === 1) player_1++;
        if(v === 2) player_2++;

      }

      // if player has enough consequtive pieces in line
      if(this.checkWinnerCount(player_1,player_2)){
        return this.checkWinnerCount(player_1,player_2)
      }

    }


    // resetting for future checks
    player_1 = 0;
    player_2 = 0;

    // checking diagonal left
    for(let i = 0 ; i < this.size ; i++){

      let v = this.value(i,i)

      // incrementing correct player value
      if(v === 1) player_1++;
      if(v === 2) player_2++;
    }

    // if player has enough consequtive pieces in line
    if(this.checkWinnerCount(player_1,player_2)){
      return this.checkWinnerCount(player_1,player_2)
    }

    // resetting for future checks
    player_1 = 0;
    player_2 = 0;

    // checking diagonal right
    for(let i = 0 ; i < this.size ; i++){

      let v = this.value(i-this.size-1,i)

      // incrementing correct player value
      if(v === 1) player_1++;
      if(v === 2) player_2++;
    }

    // if player has enough consequtive pieces in line
    if(this.checkWinnerCount(player_1,player_2)){
      return this.checkWinnerCount(player_1,player_2)
    }

    // if number of max moves has been made means draw
    if(this.moves === this.size*this.size)
      return 3;

    return null;

  }

  // setup initial players
  initialisePlayers(clients){

    console.log("Sending Client Setup Bundle");

    // player incrementing
    let playerIndex = 0;

    let bundle = this.getBundle();

    for(var client of clients){

      // incrementing player
      bundle.player = ++playerIndex;

      // transmitting setup bundle to client
      client.transmit(MessageType.INIT,bundle);

      // setting up on event hooks
      client.setEmitHook(MessageType.TILECLICK,((pos) => {

        console.log(`Player ${client.id} Clicked Tile - ${pos.x}:${pos.y}`);

      }).bind(this));

    }


  }

  // this method returns the bundle
  getBundle(){
    return this.bundle;
  }

  // this method is in charge of updading the client observable model
  updateBundle(){
    this.bundle.dimension = this.dimension;
    this.bundle.turn  = this.turn;
    this.bundle.board = this.board;
    return this.bundle
  }

  update(){

    let recieve = null;

    if(this.recieve) recieve = this.recieve()

    let won = this.won();

    if(won === 1) console.log("Player 1 has Won!");
    if(won === 2) console.log("Player 2 has Won!");
    if(won === 3) console.log("Game is a Draw!");
    // if(!won) console.log("Still in Play!");

    return this.updateBundle();

  }
}

module.exports = TicTacToe;
