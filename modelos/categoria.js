const Joi = require('joi');
const mongoose = require('mongoose');

const PRECIO_MIN = 1000;
const PRECIO_MAX = 10000;

// Esquema de la categoría 
const esquemaCategoria = new mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 16
  },
  precio: {
    type: Number,
    required: true,
    min: PRECIO_MIN,
    max: PRECIO_MAX
  }
});

// Modelo que define a la entidad de la categoría 
const Categoria = mongoose.model('Categoria', esquemaCategoria);

// Método para validar los datos de la categoría que se ingresa 
function validarCategoria(categoria){
  const esquemaValido = Joi.object({
    nombre: Joi.string().min(1).max(16).required(),
    precio: Joi.number().min(PRECIO_MIN).max(PRECIO_MAX).required()
  });

  return esquemaValido.validate({ nombre: categoria.nombre, precio: categoria.precio });
}

// Se disponibiliza la exportación del esquema y modelo de la categoría y el método de validación
exports.esquemaCategoria = esquemaCategoria;
exports.Categoria = Categoria;
exports.validar = validarCategoria;