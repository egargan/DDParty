//
// // enum of various controls
// const Control = require('../shared/Control');
//
// // link to server utilities module
// const ServerUtility = require('../../utilities')
//
// class Controller {
//
//   constructor(client) {
//
//     this.client = client;
//
//     this.callbacks = {}
//
//   }
//
//   setup(){
//
//     for(var control in Control){
//       this.callbacks.control = [];
//       this.client.setEmitHook(control)
//     }
//
//   }
//
//   getId(){
//     return this.client.getIdString();
//   }
//
//   setControlHook(key,callback){
//
//     // checking function is valid
//     if(!ServerUtility.isFunc(callback)) return false;
//
//     // checking control exists
//     if(!Control.hasOwnProperty(key)) return false;
//
//     console.logDD('CONTROLLER',`Key ${key} Control Callback Added`);
//
//     this.callbacks.key.push(callback);
//
//   }
//
//   update(){}
//
// }
//
// module.exports = Controller;
