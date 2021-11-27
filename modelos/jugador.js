const config = require('config');
const jwt = require('jsonwebtoken');
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
        maxlength: 32,
        unique: true
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

// Método para generar un JWT en el momento que el administrador se autentique en la aplicación  
esquemaJugador.methods.generateAuthToken = function() { 
    return jwt.sign({ _id: this._id }, config.get('claveJWTJ'));
}

// Modelo que define a la entidad del jugador 
const Jugador = mongoose.model('Jugador', esquemaJugador);

// Método para validar los datos del jugador que se ingresa 
function validarJugador(jugador) {
    const esquemaValido = Joi.object({
        alias: Joi.string().min(5).max(32).required(),
        contrasenia: Joi.string().min(5).max(255).required()
    });
    return esquemaValido.validate({ alias: jugador.alias, contrasenia: jugador.contrasenia });
}

// Se disponibiliza la exportación del esquema, del modelo del jugador y el método de validación 
exports.esquemaJugador = esquemaJugador;
exports.Jugador = Jugador;
exports.validar = validarJugador;