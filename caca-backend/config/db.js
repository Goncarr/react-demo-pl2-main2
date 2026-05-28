const mongoose = require('mongoose');

// Conecta à base de dados MongoDB usando o MONGO_URI
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado com sucesso ao MongoDB!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;