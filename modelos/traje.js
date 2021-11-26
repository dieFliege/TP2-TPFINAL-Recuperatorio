const mongoose = require('mongoose');

/**
 * Se importa el esquema del traje 
 * La categoría es parte de la definición del modelo del traje 
 */
const {esquemaCategoria} = require('./categoria');

// Esquema del traje  
const esquemaTraje = new mongoose.Schema({
    nombre: {
        type: String,
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
        type: esquemaCategoria,  
        required: true
    },
});

// Modelo que define a la entidad del traje 
const Traje = mongoose.model('Traje', esquemaTraje);

// Se disponibiliza la exportación del esquema y modelo del traje 
exports.esquemaTraje = esquemaTraje;
exports.Traje = Traje;