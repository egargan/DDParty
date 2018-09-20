
// express server module
var express = require('express');

// request routing
var router = express.Router();

// home page ( index for games and new player )
router.get(['/','/home','/main'],(req, res, next) => {
  res.render('home',{title:'home'})
});

// player output
router.get('/player',(req, res, next)=>{
  res.render('player',{title:'Player'})
})

// render output
router.get('/screen',(req, res, next)=>{
  res.render('screen',{title:'Screen'})
})

// refactor for multi-game archtiecture

// pong routing
router.get('/pong',(req, res, next)=>{
  res.render('pong',{title:'Pong'})
})

// asteroid routing
router.get('/asteroids',(req, res, next)=>{
  res.render('asteroids',{title:'Asteroids'})
})


// exporting module
module.exports = router;
