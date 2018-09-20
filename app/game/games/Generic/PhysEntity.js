
const Entity = require('./Entity');

const Utility = require('./Utilities');

const Vector = require('./Vector');

class PhysEntity extends Entity {

  constructor(pos,size){

    super(pos,size);

    // backup position
    this.pos_ = new Vector(pos.x,pos.y);

    this.vel = new Vector(0,0);

    this.acc = new Vector(0,0);

    this.friction = new Vector(0.97,0.97);

    this.speed = new Vector(5,5);

    // direction in degree's ( not radians )
    this.direction = 0;

    // speed of offset
    this.turnSpeed = 1;

    this.intendedDirection = 0;

  }

  getVel(){
    return this.vel;
  }

  getAcc(){
    return this.acc;
  }

  getFriction(){
    return this.friction;
  }

  getSpeed(){
    return this.speed;
  }

  getDirection(){
    return this.direction;
  }

  setVel(vel){
    this.vel.set(vel);
  }

  setAcc(acc){
    this.acc.set(acc);
  }

  setFriction(friction){
    this.friction.set(friction);
  }

  setSpeed(speed){
    this.speed.set(speed);
  }

  changeDirection(offset){

    this.offset = offset;

    this.direction 
  }

  directionVector(){
    return new Vector(
      Utility.roundTo(Math.cos(Utility.radian(this.getDirection())),5),
      Utility.roundTo(Math.sin(Utility.radian(this.getDirection())),5)
    )
  }

  applyForwardImpulse(){

    // console.logDD('PHYENTITY',` ${ this.directionVector().scale(0) } `);

    this.applyImpulse(
      this.directionVector().scale(
        this.getSpeed()
      )
    )

  }

  applyImpulse(impulse){
    // applying an increment of impulse to acceleration vector
    this.acc.add(impulse)
  }

  evalImpulse(){

    // setting back up position
    this.pos_.set(this.getPos());

    // updating velocity with acceleration
    this.vel.add(this.acc);

    // updating position velocity vector
    this.pos.add(this.vel);

    this.acc.scale(0);

    // setting velocity scale by friction value
    this.vel.scale(this.getFriction());

  }

  update(delta){

    super.update(delta);

    // evaluation of impulse forces on body
    this.evalImpulse();

    // this.direction = ( this.direction < 360 ? this.direction + 1 : 0 )


  }

}

module.exports = PhysEntity;
