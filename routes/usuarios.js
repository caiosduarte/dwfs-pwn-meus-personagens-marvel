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

router.get('/favoritos', (req, res) => {
  let token = verificaUsuarioLogado().token;

  var personagens = [];
  var total = 0;

  Usuarios.findOne().where({token})
    .then(usuario => {
      getFavoritos(usuario.favoritos)
      .then(resultado => {
        personagens = resultado;
        total =  usuario.favoritos.length;                
      });
    })
    .catch(e => {console.log(e);})
    .then(() => {
      console.log(`personagens: ${personagens.length}`);
      res.render('favorito', {personagens, total});
    });
});

async function getFavoritos(ids) {
  let favoritos = [];
  ids.forEach(id => {
    let stringPesquisa = `${apiMarvel.URL_BASE}/${id}${apiMarvel.AUTH}`;
    axios.get(stringPesquisa)
    .then(response => {
      if (response.status == 200) {            
          response.data.data.results.forEach(character => {
            let id = character.id;
    
            let personagem = {
                id,
                nome: character.name,
                descricao: character.description,
                thumbnail: `${character.thumbnail.path}/standard_medium.${character.thumbnail.extension}`,
                foto: `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`
            };      
            favoritos.push(personagem);            
            console.log(`favorito => ${personagem.nome}`);
        });
      }
    });  
  });

  
  return favoritos;
}

function getFavorito(id) {
  let personagem;
  let stringPesquisa = `${apiMarvel.URL_BASE}/${id}${apiMarvel.AUTH}`;
  axios.get(stringPesquisa)
  .then(response => {
    if (response.status == 200) {            
        apiMarvel.converteCharacterMarvel(response.data.data.results)
        .then(p => {
          personagem = p;          
        })
        .catch(e => {console.log(e);});         
    }
  });
  return personagem;
}

module.exports = router;
