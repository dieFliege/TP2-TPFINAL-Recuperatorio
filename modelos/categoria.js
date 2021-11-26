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

// Se disponibiliza la exportación del esquema y modelo de la categoría 
exports.esquemaCategoria = esquemaCategoria;
exports.Categoria = Categoria;