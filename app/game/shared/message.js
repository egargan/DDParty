
const MessageType = {
  JOINPLAYER   :'join-player',
  JOINSCREEN   : 'join-screen',
  ROOMKEY      : 'room-key',
  ROOMKEYINPUT : 'room-key-input',
  GAMETYPE     : 'game-type',
  CLIENTSTART  : 'game-type',
  PLAYERJOINEDLOBBY  : 'player-joined-lobby',
  SCREENSIZE : 'screen-size',
  EXITROOM  : 'exit-room',
  KICKPLAYER  : 'kick-player',
  CONTROL : 'control',
  INIT   :'initialise-game',
  UPDATE :'update-game',
  PAUSE  :'pause-game',
  EJECT  :'eject-game',
  CLICK  :'click-canvas',
  WARNING:'warning'
}

module.exports = MessageType;
