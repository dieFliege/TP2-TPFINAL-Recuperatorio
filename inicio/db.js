const config = require('config');
const mongoose = require('mongoose');

// Se disponibiliza la conexión a la base de datos
module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db)
    .then(() => console.log(`Conectado a ${db}...`)
    .catch(err => console.error(`No se pudo conectar a ${db}...`)));
}