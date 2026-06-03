const express = require('express');

const userRoutes = require('./routes/userRoutes');
const experimentosRoutes = require('./routes/experimentosRoutes');
const chartRoutes = require("./routes/chartRoutes");
const app = express();
const cors = require("cors");


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api/users', userRoutes);
app.use('/api/charts', chartRoutes)
app.use('/api/experimentos', experimentosRoutes);

module.exports = app;