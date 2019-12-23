var express = require('express');
var router = express.Router();


router.post('/login', function(req, res) {
  let session = req.session;
  session.usuario = req.body.usuario;
  console.log(`usuario: ${session.usuario}`);  
  res.render('index', {session});
});

router.get('/logout', function(req, res) {
  req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    }
    res.redirect('/');
  });
});

/* codigo antigo */

let users = {items: []};

router.get('/', function(req, res, next) {
  res.json(users.items);
});

router.get('/:email', function(req, res, next) {
  res.json(users.items.filter(u => u.email == req.params.email));
});

router.post('/', function(req, res, next) {
  users.items.push(req.body);
  res.json({"status": res.statusCode});
 
});

router.delete('/:email', function(req, res, next) {
  users.items = users.items.filter(u => u.email != req.params.email);
  res.json({"status": res.statusCode});
 
});

module.exports = router;
