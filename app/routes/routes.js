
// express server module
var express = require('express');

// request routing
var router = express.Router();

router.get(['/','/home','main'],(req, res, next) => {
  res.render('home',{title:'Home'})
});

router.get(['/play'],(req, res, next) => {
  res.render('play',{title:'title'})
});

// exporting module
module.exports = router;
