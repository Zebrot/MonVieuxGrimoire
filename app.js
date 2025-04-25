const express = require('express');
const app = express();
const mongoose = require('mongoose');
const SECRET_CONSTANTS = require('./utils/private/constants')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json());

mongoose.connect(SECRET_CONSTANTS.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);



module.exports = app;