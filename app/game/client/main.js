
// IMPORTS

const grageo = require('./grageo');

const V = require('../lib/vector');

const Colour = require('../lib/colour');

const TicTacToe = require('./TicTacToe');

const MessageType = require('../shared/message');

window.onload = () => {

  // storing reference to grageo
  const g = grageo;

  // storing reference to Draw methods
  const Draw = g.Draw;

  // storing reference to Utility methods
  const Util = g.Util;

  // socket initialisation
  const socket = io();

  socket.on('connect',(data) => {

    // initialising tictactoe game objec
    let tictactoe = new TicTacToe();

    // setting board click hook for when a tile is pressed
    tictactoe.setBoardClickHook((tile) => {

      console.log(`Main Tile Clicked ${tile.toString()}`);

        // click event hook
        socket.emit(MessageType.TILECLICK,tile);
    })

    // call to join lobby on server side
    socket.emit(MessageType.JOIN,() => {
      // nothing to do
    });

    // initialising tictactoe
    socket.on(MessageType.INIT,(bundle) => {
      tictactoe.setup(bundle)
    })

    // update for client bundle
    socket.on(MessageType.UPDATE,(bundle) => {
      // console.log(bundle);
      tictactoe.update(bundle);
    })

    // undefined behaviour, used to catch game destruction
    socket.on(MessageType.EJECT,() => {
      // nothign to do
    })

    // setting canvas parent container
    g.Control.parent('page-container');

    // setting click event hook in grageo
    g.Control.setClickEvent(() => {

      // // checking tic tac toe for inside tile click
      // tictactoe.checkClickedTile((success,tile) => {
      //
      //   // checking click event
      //   if(success){
      //     console.log(`Tile On Click Sucess : ${success} at ${tile.x}:${tile.y}...`);
      //   }
      //
      // })

    })

    // // setting click event hook in grageo
    // g.Control.setMouseMoveEvent(() => {
    //   // click event hook
    //   socket.emit(MessageType.CLICK,() => {})
    // })


    // draw loop callback
    g.Control.setDraw (() => {

      // updating tictactoe
      tictactoe.update();

      // drawing tictactoe
      tictactoe.draw();

    })

  })


}
