// En este módulo se almacena la variable de entorno que utilizamos para la autenticación con JWTs
const config = require('config');

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

// Esquema del administrador 
const esquemaAdministrador = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 64,
        unique: true
    },
    contrasenia: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

// Método para generar un JWT en el momento que el administrador se autentique en la aplicación  
esquemaAdministrador.methods.generateAuthToken = function() { 
    return jwt.sign({ _id: this._id }, config.get('claveJWTA'));
}

// Modelo que define a la entidad del administrador 
const Administrador = mongoose.model('Administrador', esquemaAdministrador);

// Método para validar los datos del administrador que se ingresa 
function validarAdministrador(administrador) {
  const esquemaValido = Joi.object({
    nombre: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    contrasenia: Joi.string().min(5).max(255).required()
  });

  return esquemaValido.validate({ 
      nombre: administrador.nombre,
      email: administrador.email,
      contrasenia: administrador.contrasenia 
    });
}

/** 
 * Se disponibiliza la exportación del modelo del administrador 
 * y el método de validación de los datos ingresados 
 */
exports.Administrador = Administrador; 
exports.validar = validarAdministrador;