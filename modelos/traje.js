const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const PRECIO_MIN = 1000;
const PRECIO_MAX = 10000;

// Esquema del traje  
const esquemaTraje = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true,
        trim: true, 
        minlength: 1,
        maxlength: 32
    },
    primeraAparicion: {
        type: String,
        required: true,
        trim: true, 
        minlength: 1,
        maxlength: 64
    },
    anioAparicion: {
        type: String,
        required: true,
        trim: true, 
        minlength: 4,
        maxlength: 4
    },
    descripcion: {
        type: String,
        required: true,
        trim: true, 
        maxlength: 1024
    },
    poster: {
        type: String,
        required: true,
        trim: true, 
        maxlength: 255
    },
    categoria: {
        type: new mongoose.Schema({
            nombre: {
                type: String,
                required: true,
                unique: true,
                minlength: 1,
                maxlength: 16
              }
        }),
        required: true
    }
});

// Modelo que define a la entidad del traje 
const Traje = mongoose.model('Traje', esquemaTraje);

// Método para validar los datos del traje que se ingresa
function validarTraje(traje){
    const esquemaValido = Joi.object({
        nombre: Joi.string().min(1).max(32).required(),
        primeraAparicion: Joi.string().min(1).max(64).required(),
        anioAparicion: Joi.string().min(4).max(4).required(),
        descripcion: Joi.string().max(1024).required(),
        poster: Joi.string().max(255).required(),
        categoriaId: Joi.objectId().required()
      });
    
      return esquemaValido.validate({ 
          nombre: traje.nombre, 
          primeraAparicion: traje.primeraAparicion,  
          anioAparicion: traje.anioAparicion,
          descripcion: traje.descripcion,
          poster: traje.poster,
          categoriaId: traje.categoriaId
        });
}

// Se disponibiliza la exportación del esquema y modelo del traje y el método de validación
exports.esquemaTraje = esquemaTraje;
exports.Traje = Traje;
exports.validar = validarTraje;