const mongoose = require('mongoose');

const MIN_PUNTOS = 0;
const MAX_PUNTOS = 150000;

// Esquema del jugador    
const esquemaJugador = new mongoose.Schema({
    alias: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 32
    },
    contrasenia: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    puntos: {
        type: Number,
        required: true,
        min: MIN_PUNTOS,
        max: MAX_PUNTOS
    }
});

// Modelo que define a la entidad del jugador 
const Jugador = mongoose.model('Jugador', esquemaJugador);

// Se disponibiliza la exportación del esquema y modelo del jugador 
exports.esquemaJugador = esquemaJugador;
exports.Jugador = Jugador;