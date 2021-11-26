const Joi = require('joi');
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

// Método para validar los datos del jugador que se ingresa 
function validarJugador(jugador) {
    const esquemaValido = Joi.object({
        alias: Joi.string().min(5).max(32).required(),
        contrasenia: Joi.string().min(5).max(255).required(),
        puntos: Joi.number().min(MIN_PUNTOS).max(MAX_PUNTOS).required(),
    });
  
    return esquemaValido.validate({ alias: jugador.alias, contrasenia: jugador.contrasenia, puntos: jugador.puntos });
  }

// Se disponibiliza la exportación del esquema, del modelo del jugador y el método de validación 
exports.esquemaJugador = esquemaJugador;
exports.Jugador = Jugador;
exports.validar = validarJugador;