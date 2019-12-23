var express = require('express');
var router = express.Router();

const verificaUsuarioLogado = require('../services/verifica-usuario');


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

router.get('/favoritos', (req, res) => {
  let token = verificaUsuarioLogado().token;



});

module.exports = router;
