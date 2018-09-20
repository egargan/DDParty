// extends the base game class
// this class represents the first kind of playable game that
const MessageType = require('../shared/message')

// importing vector class
const Vector = require('./Generic/Vector');

// importing utility class
const Utilities = require('./Generic/Utilities');

// base game class
const Game = require('../server/Game');

// player controller
const Controller = require('../server/Controller')

// base controller class
const Asteroid = require('./Asteroid');


class Asteroids extends Game {

  constructor() {
    super();

    this.type = 'asteroids';
  }

  setup(){

    console.logDD('ASTEROIDS','Asteroids Setup!');

    this.bundle = {
      tick:0,
      players:0
    }

  }

  initialisePlayer(client){

    // creating new player object
    let player = new Asteroid(
      client,
      this.middleScreenPosition(),
      // this.randomScreenPosition(),
      new Vector(50,50)
    );

    // seting up player object
    player.setup()

    // adding player object to collection
    this.players.push(player)

    // incremting bundle
    this.bundle.players += 1;

  }

  updatePlayers(deltaTime){

    this.bundle.players = {};

    this.bundle.playerCount = this.players.length;

    for(var player of this.players){

      player.update(deltaTime);

      if(this.offScreen(player.getPos())){
        player.setPos(this.middleScreenPosition())
      }

      this.bundle.players[player.getId()] = player.getBundle();

    }

  }

  update(deltaTime){

    this.bundle.tick++;

    this.updatePlayers(deltaTime);

    return this.getBundle();

  }

}

module.exports = Asteroids;
