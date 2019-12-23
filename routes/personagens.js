var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiMarvel = require('../services/api-marvel.js');
const Usuarios = require('../store/Usuario');
const verificaUsuarioLogado = require('../services/verifica-usuario');

router.get('/:id', function(req, res, next) {
  let id = req.params.id; 

  let stringPesquisa = `${apiMarvel.URL_BASE}/${id}${apiMarvel.AUTH}`;    
  axios.get(stringPesquisa)
  .then(response => {    
      if(response.status == 200) {            
          let personagem = apiMarvel.converteCharacterMarvel(response.data.data.results)[0];          
          res.render('personagem', {personagem});
      } else {
          return;
      }            
  })
  .catch(error => {
      console.error(error);
      return;                
  });     
});

router.get('/:id/favorita', function(req, res, next) {
    let personagemId = req.params.id;        
    let token = verificaUsuarioLogado().token;    

    Usuarios.updateOne({token}, {$push: {favoritos: personagemId}, upsert:false})
    .then(() => {
        console.log('Favorito acrescentado.');        
    })    
    .catch(() => {
        console.log('Erro ao acrescentar personagem favorito.')
    });

    res.redirect(`/personagens/${personagemId}`);
});

router.get('/:id/desfavorita', function(req, res, next) {
    let id = req.params.id;    
    console.log(`Desfavorita ${id}`);
    res.redirect(`/personagens/${id}`);
});

module.exports = router;
