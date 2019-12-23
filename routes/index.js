var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiMarvel = require('../services/api-marvel.js');
const Usuarios = require('../store/Usuario');
const verificaUsuarioLogado = require('../services/verifica-usuario');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/login', function(req, res) {
	let urlChamador = `${req.query.urlChamador}`;
	res.render('login', { urlChamador, semMenu: true });
});

router.get('/busca', function(req, res) {
	let q = req.query.q;
	let offset = req.query.offset ? req.query.offset : 0;
  let stringPesquisa = `${apiMarvel.URL_BASE}${apiMarvel.AUTH}&nameStartsWith=${q}&limit=10&orderBy=name&offset=${offset}`;
  var personagens = [];
  var total;
  var paginas;
	axios.get(stringPesquisa).then((response) => {
		if (response.status == 200) {
				response.data.data.results.forEach((character) => {
					let id = character.id;

					let personagem = {
						id,
						nome: character.name,
						descricao: character.description,
						thumbnail: `${character.thumbnail.path}/standard_medium.${character.thumbnail.extension}`,
						foto: `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`,
						favorito: false
					};
					
					personagens.push(personagem);
				});
				total = response.data.data.total;

				let paginas = [];
				for (let i = 0, numero = 1; i < total && total / 10 >= 1; i += 10, numero++) {
					let pagina = {
						url: `/busca?q=${req.query.q}&offset=${i}`,
						numero
					};
					paginas.push(pagina);
				}

					
		}
  })
  .then(() => {
    var favoritos = [];
    let token = verificaUsuarioLogado().token;
    Usuarios.findOne().where({ token }).then((usu) => {
      favoritos = usu.favoritos;  
      console.log(`favoritos: ${favoritos}`);
      personagens.forEach(p => {
        p.favorito = favoritos.findIndex((f) => {f == p.id}) >= 0;
        console.log(`personagem: ${p.id}`);
      });
    }).finally(()=> {
      res.render('index', { q, total, personagens, paginas });	
    })    
  });
});

module.exports = router;
