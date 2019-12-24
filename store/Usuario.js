const mongoose = require('mongoose');

const personagemSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    nome: {
        type: String
    },
    descricao: {
        type: String
    },
    thumbnail: {
        type: String
    },
    foto: {
        type: String
    }
});

const Personagem = mongoose.model('Personagem', personagemSchema);

const usuarioSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    token: {
        type: String
    },
    nome: {
        type: String
    }, 
    favoritos: {
        type: [Number]
    },
    favoritos2: {
        type: [mongoose.Schema.personagemSchema]
    }
    });    
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;