
// message enum for consistency between server and client communications
const MessageType = require('../../shared/message');

module.exports = (function(){

  var roomKeyOverlay = null;

  var roomKeyTextInput = null;

  var roomKeySubmitInput = null;

  var bannerText = null

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

    roomKeyTextInput.onkeyup = Methods.liveValidateText;

    // setting key down event to fire on submit method
    roomKeySubmitInput.onclick = Methods.onRoomKeySubmit;
    roomKeyTextInput.onsubmit  = Methods.onRoomKeySubmit;

  }

  Methods.liveValidateText = (e) => {
    let value = roomKeyTextInput.value || '';
    let input = "";

    if (value.length > 5) {
      input = value.slice(0, 5);
    } else {
      input = value.toUpperCase();
    }

    // storing reference to warning text banner
    bannerText = document.getElementsByClassName('warning-banner-text')[0];

    roomKeyTextInput.value = input;

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
    text = text.toUpperCase();
    if(text.length === 0) return false;
    if(text.length > 10) return false;
    if(text === '' || text === null) return false;
    return true;
  }

  Methods.hideOverlay = () => {
    roomKeyOverlay.style.display = 'none';
  }

  Methods.displayWarning = (warning) => {

    // setting banner text
    bannerText.text = warning;
    bannerText.style.display = 'inline';

    setTimeout(() => {
      console.log('Clearing Banner!');
      Methods.clearWarning()
    },5000)
  }

  Methods.clearWarning = () => {
    // setting banner text
    bannerText.text = '';
    bannerText.style.display = 'none';
  }

  Methods.buildGui = (game) => {
    let container = document.createElement('div');
    container.setAttribute('class', 'container');
    container.setAttribute('id', 'btn-container');
    document.body.appendChild(container);

    if (game === 'asteroids') {
      Methods.buildAstroidsGui();
    } else if (game === 'pong') {
      Methods.buildPongGui();
    } else {
      console.log(`game \'${game}\' does not exist`)
    }
  }

  Methods.createButton = (project, name) => {
    let a = document.createElement('a');
    a.text = name;
    a.setAttribute('class', 'button ' + project + ' ' + name);
    a.setAttribute('href', '#');
    a.onclick = () => {
      socket.emit(MessageType.CONTROL, name);
      console.log(name);
    }
    document.getElementById('btn-container').appendChild(a);

    return a;
  }

  Methods.buildAstroidsGui = () => {
    // document.body.style.backgroundColor = 'red';

    const left = Methods.createButton('asteroids', 'left');

    const right = Methods.createButton('asteroids', 'right');

    const thrust = Methods.createButton('asteroids', 'thrust');

    const fire = Methods.createButton('asteroids', 'fire');
  }

  Methods.buildPongGui = () => {
    const up = Methods.createButton('pong', 'up');
    const down = Methods.createButton('pong', 'down');
  }

  // when page load is complete
  window.onload = () => {

    // socket initialisation
    socket = io();

    // attempt connection to server socket
    socket.on('connect',(data) => {

      console.log("GUI - Socket Connected!");

      socket.on(MessageType.GAMETYPE,(type) => {
        console.log('Game Type Received!', type);
        Methods.buildGui(type);
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

      // when server sends a warning message to the client
      socket.on(MessageType.WARNING,(warning) => {
        // parsing through gui
        Methods.displayWarning(warning);
      });

      // setup module
      Methods.setup();

    })

  }

  // put things here that you want to be made public
  return {
  }

}());
