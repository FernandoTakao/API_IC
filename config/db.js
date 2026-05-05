const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/outroBanco');
        console.log('MongoDB conectado');
    } catch (err) {
        console.log('Erro ao conectar:', err);
        process.exit(1);
    }
};

module.exports = connectDB;