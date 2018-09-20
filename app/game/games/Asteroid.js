
// this class represents a playable entity that is directly linked
// to player input, each instance will be singly linked to a client

const MessageType = require('../shared/message')

// importing vector class
const Vector = require('./Generic/Vector');

// importing utility class
const Utilities = require('./Generic/Utilities');

// importing entity
const PhysEntity = require('./Generic/PhysEntity');

// base game class
const Game = require('../server/Game');

// enum of control input types
const Control = require('../shared/Control');

class Asteroid extends PhysEntity {

  constructor(client,pos,size) {

    super(pos,size)

    // passing in controller
    this.client = client;

  }

  getId(){
    return this.client.getId();
  }

  getController(){
    return this.controller;
  }

  setController(controller){
    this.controller = controller;
  }

  setup(){

    console.logDD('ASTEROID','Player Setup!');

    // player controller hook for up input
    this.client.setControlHook(Control.THRUST,(event) => {

      // console.logDD('ASTEROID','Player Pressed THRUST ');
      // console.logDD('ASTEROID',this);

      this.applyForwardImpulse();


    });

    // player controller hook for down input
    this.client.setControlHook(Control.FIRE,(event) => {
      console.logDD('ASTEROID','Player Pressed FIRE ');
    })

    // player controller hook for down input
    this.client.setControlHook(Control.LEFT,(event) => {

      this.direction+=15;

      console.logDD('ASTEROID','Player Pressed LEFT ');
    })

    // player controller hook for down input
    this.client.setControlHook(Control.RIGHT,(event) => {

      this.direction-=15;

      console.logDD('ASTEROID','Player Pressed RIGHT ');
    })

  }

  getBundle(){
    return {
      pos  : this.getPos(),
      size : this.getSize(),
      direction : this.getDirection()
    }
  }

  update(delta){

    super.update(delta);

    // console.logDD('ASTEROID',`Asteroid Size : ${this.getSize()}`);

  }

}


module.exports = Asteroid;
