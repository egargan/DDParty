
// message enum for consistency between server and client communications
const MessageType = require('../../shared/message');

module.exports = (function(){

  var roomKeyOverlay = null;

  var roomKeyTextInput = null;

  var roomKeySubmitInput = null;

  var socket = null;

  // object of functions ( if we want to export them )
  var Methods = {}

  Methods.setup = () => {

    // storing reference to overlay container for room key input
    roomKeyOverlay = document.getElementsByClassName('key-input-overlay')[0];

    // storing reference to enter button for room key
    roomKeySubmitInput = document.getElementsByClassName('key-input')[0];

    // storing reference to text input button for room key
    roomKeyTextInput   = document.getElementsByClassName('key-text')[0];

    // setting key down event to fire on submit method
    roomKeySubmitInput.onclick = Methods.onRoomKeySubmit;

  }

  Methods.onRoomKeySubmit = (e) => {

    // fetching input room key text
    var inputText = roomKeyTextInput.value || '';

    // assuming text input is okay!
    if(Methods.roomKeyValidation(inputText)){
      console.log(inputText);

      // attempt sending of roomkey
      socket.emit(MessageType.ROOMKEYINPUT,inputText)

    } else {
      console.log('Room Key entered Sucks!')
    }

  }

  // method that will verify input is logical
  Methods.roomKeyValidation = (text) => {
    if(text.length === 0) return false;
    if(text.length > 10) return false;
    if(text === '' || text === null) return false;
    return true;
  }

  Methods.hideOverlay = () => {
    roomKeyOverlay.style.display = 'none';
  }

  // when page load is complete
  window.onload = () => {

    // socket initialisation
    socket = io();

    // attempt connection to server socket
    socket.on('connect',(data) => {

      console.log("GUI - Socket Connected!");

      socket.on(MessageType.GAMETYPE,(type) => {
        console.log('Game Type Received!',type);
        Methods.hideOverlay();
      })

      // call to join lobby on server side
      socket.emit(MessageType.JOINPLAYER,() => {
        // nothing to do
      });

      // call to join lobby on server side
      socket.emit(MessageType.UPDATE,(bundle) => {
        console.log("UPDATE",bundle);
      });

      // setup module
      Methods.setup();

    })

  }

  // put things here that you want to be made public
  return {
  }

}());
