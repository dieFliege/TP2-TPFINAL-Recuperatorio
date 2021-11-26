const mongoose = require('mongoose');

// Se disponibiliza la conexión a la base de datos
module.exports = function() {
    mongoose.connect('mongodb://localhost/spiderSuits')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB...'));
}