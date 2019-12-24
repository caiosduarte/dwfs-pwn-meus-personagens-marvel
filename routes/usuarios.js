var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiMarvel = require('../services/api-marvel.js');
const verificaUsuarioLogado = require('../services/verifica-usuario');
const Usuarios = require('../store/Usuario');

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
/*
router.get('/favoritos', (req, res) => {
  let token = verificaUsuarioLogado().token;

  var personagens = [];
  var total = 0;

  Usuarios.findOne().where({token})
    .then(usuario => {

      usuario.favoritos.forEach(id => {
        let stringPesquisa = `${apiMarvel.URL_BASE}/${id}${apiMarvel.AUTH}`;
        
        axios.get(stringPesquisa)
        .then((response) => {
          if (response.status == 200) {
            
            //personagens = apiMarvel.converteCharacterMarvel(response.data.data.results); 
            response.data.data.results.forEach(character => {
              let id = character.id;
    
              let personagem = {
                  id,
                  nome: character.name,
                  descricao: character.description,
                  thumbnail: `${character.thumbnail.path}/standard_medium.${character.thumbnail.extension}`,
                  foto: `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`
              };      
              personagens.push(personagem);
              console.log(`personagem: ${personagem.nome}`);  
              console.log(`personagens: ${personagens[0]}`);  
            }); 
    
          }
        })
        
      });

      total =  usuario.favoritos.length;
      console.log(`personagens: ${personagens}`);
    })
    .catch(e => {console.log(e);})
    .finally(() => {
      res.render('favorito', {personagens, total});

      
    });
});
*/

module.exports = router;
