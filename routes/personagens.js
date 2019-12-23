var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiMarvel = require('../services/api-marvel.js');
const Usuarios = require('../store/Usuario');
const verificaUsuarioLogado = require('../services/verifica-usuario');

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    var personagens = [];

	let stringPesquisa = `${apiMarvel.URL_BASE}/${id}${apiMarvel.AUTH}`;
	axios
		.get(stringPesquisa)
		.then((response) => {
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


			}
		})
		.then(() => {
			var favoritos = [];
			let token = verificaUsuarioLogado().token;
			Usuarios.findOne()
				.where({ token })
				.then((usu) => {
					favoritos = usu.favoritos;
					console.log(`favoritos: ${favoritos}`);
					personagens.forEach((p) => {
						p.favorito =
							favoritos.findIndex((f) => {
								f == p.id;
							}) >= 0;
						console.log(`personagem: ${p.id}`);
					});
				})
				.finally(() => {
					res.render('personagem', { personagem: personagens[0]});
				});
		});
});

router.get('/:id/favorita', function(req, res, next) {
	let personagemId = req.params.id;
	let token = verificaUsuarioLogado().token;

	Usuarios.updateOne({ token }, { $push: { favoritos: personagemId }, upsert: false })
		.then(() => {
			console.log('Favorito acrescentado.');
		})
		.catch(() => {
			console.log('Erro ao acrescentar personagem favorito.');
		});

	res.redirect(`/personagens/${personagemId}`);
});

router.get('/:id/desfavorita', function(req, res, next) {
	let personagemId = req.params.id;
	let token = verificaUsuarioLogado().token;

	Usuarios.updateOne({ token }, { $pull: { favoritos: personagemId }, upsert: false })
		.then(() => {
			console.log('Favorito acrescentado.');
		})
		.catch(() => {
			console.log('Erro ao acrescentar personagem favorito.');
		});

	res.redirect(`/personagens/${personagemId}`);
});

module.exports = router;
