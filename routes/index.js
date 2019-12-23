var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiMarvel = require('../services/api-marvel.js');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res) {  
  let urlChamador = `${req.query.urlChamador}`;
  res.render('login', {urlChamador, semMenu: true});
});

router.get('/busca', function(req, res) {  
  let q = req.query.q;  
  let offset = req.query.offset? req.query.offset: 0;
  let stringPesquisa = `${apiMarvel.URL_BASE}${apiMarvel.AUTH}&nameStartsWith=${q}&limit=10&orderBy=name&offset=${offset}`;    
  axios.get(stringPesquisa)
  .then(response => {    
      if(response.status == 200) {            
          let personagens = apiMarvel.converteCharacterMarvel(response.data.data.results);  
          let total = response.data.data.total;          

          let paginas = []
          for(let i=0, numero=1; i<total && total/10 >= 1; i+=10, numero++) {
            let pagina = {
              url: `/busca?q=${req.query.q}&offset=${i}`,
              numero
            }  
            paginas.push(pagina);
          } 
          res.render('index', {q, total, personagens, paginas});
      } else {
          return;
      }            
  })
  .catch(error => {
      console.error(error);
      return;                
  });     

});

module.exports = router;