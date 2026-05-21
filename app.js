const express = require('express');

const userRoutes = require('./routes/userRoutes');
const experimentosRoutes = require('./routes/experimentosRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api/users', userRoutes);

app.use('/api/experimentos', experimentosRoutes);

module.exports = app;