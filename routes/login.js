var express = require('express');
var router = express.Router();

router.get('/login', function (req, res) {
    console.log("Entrou no login");
    res.render('login');
  });
  
module.exports = router;
