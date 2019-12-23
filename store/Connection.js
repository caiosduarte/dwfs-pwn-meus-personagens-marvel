const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://admin:admin1234@cluster0-bglak.mongodb.net/meus_personagens_marvel?retryWrites=true&w=majority';


const openConnection = () => mongoose.connect(connectionString, { useNewUrlParser: true })

module.exports = {
    openConnection,
}