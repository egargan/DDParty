
// express server module
var express = require('express');

// request routing
var router = express.Router();

// home page ( index for games and new player )
router.get(['/','/home','main'],(req, res, next) => {
  res.render('home',{title:'Home'})
});

// player output
router.get('/player',(req, res, next)=>{
  res.render('home',{title:'Home'})
})

// render output
router.get('/screen',(req, res, next)=>{
  res.render('home',{title:'Home'})
})

// exporting module
module.exports = router;
