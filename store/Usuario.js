const mongoose = require('mongoose');

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
    }
    });    
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;