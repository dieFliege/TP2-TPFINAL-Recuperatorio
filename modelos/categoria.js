const Joi = require('joi');
const mongoose = require('mongoose');

// Esquema de la categoría 
const esquemaCategoria = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16
  }
});

// Modelo que define a la entidad de la categoría 
const Categoria = mongoose.model('Categoria', esquemaCategoria);

// Método para validar los datos de la categoría que se ingresa 
function validarCategoria(categoria){
  const esquemaValido = Joi.object({
    nombre: Joi.string().min(1).max(16).required()
  });

  return esquemaValido.validate({ nombre: categoria.nombre });
}

// Se disponibiliza la exportación del esquema y modelo de la categoría y el método de validación
exports.esquemaCategoria = esquemaCategoria;
exports.Categoria = Categoria;
exports.validar = validarCategoria;