const mongoose = require('mongoose');

// Esquema del canje 
const esquemaCanje = new mongoose.Schema({
  jugador: { 
    type: new mongoose.Schema({
      alias: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 32
      }
    }),  
    required: true
  },
  traje: {
    type: new mongoose.Schema({
      nombre: {
        type: String,
        required: true,
        trim: true, 
        minlength: 1,
        maxlength: 32
      }
    }),
    required: true
  },
  fechaCanje: {
    type: String
  }
});

// Modelo que define a la entidad del canje 
const Canje = mongoose.model('Canje', esquemaCanje);

// Método para definir la fecha del canje 
function fechaDeCanje() {
  let fecha = new Date(Date.now());
  const dia = String(fecha.getDate());
  const mes = String(fecha.getMonth());
  const anio = fecha.getFullYear();
  fecha = `${dia}/${mes}/${anio}`;
  return fecha;
}

// Se disponibiliza la exportación del modelo del canje 
exports.Canje = Canje;
exports.fechaDeCanje = fechaDeCanje;