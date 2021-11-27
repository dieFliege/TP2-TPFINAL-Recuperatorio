const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const autenticacionAdministrador = require('../middleware/autenticacionAdministrador');
const autenticacionJugador = require('../middleware/autenticacionJugador');
const validacionID = require('../middleware/validacionID');
const express = require('express');
const router = express.Router();

// Se importan los modelos del canje, el traje y del jugador  
const {Canje, fechaDeCanje} = require('../modelos/canje');
const {Jugador} = require('../modelos/jugador');  
const {Traje} = require('../modelos/traje');

// Mensajes 
const PUNTOS_INSUFICIENTES = 'Puntos insuficientes.';
const TRAJE_INVALIDO = 'Traje inválido.';
const CANJE_NO_EXISTE = 'No existe ningún canje con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todos los canjes) 
router.get('/', autenticacionAdministrador, async (req, res) => {
  const canjes = await Canje.find();
  res.send(canjes);
});

// Endpoint para método POST de HTTP (agrega un canje)
router.post('/', autenticacionJugador, async (req, res) => {
  const { error } = validar(req.body);
  if(!error){
    const jugador = await Jugador.findById(req.jugador._id);
    const traje = await Traje.findById(req.body.trajeId);
    if(traje){
      if(traje.categoria.precio <= jugador.puntos){
        let canje = new Canje({
          jugador: {
              _id: jugador._id,
              alias: jugador.alias
          },
          traje: {
              _id: traje._id,
              nombre: traje.nombre
          },
          fechaCanje: fechaDeCanje()
        });
        jugador.puntos = jugador.puntos - traje.categoria.precio;
        await jugador.save();
        await canje.save();
        res.send(canje);
      } else {
        res.status(400).send(PUNTOS_INSUFICIENTES);
      }
    } else {
        res.status(400).send(TRAJE_INVALIDO);
    }
  } else {
    res.status(400).send(error.details[0].message);
  }
});

// Endpoint para método GET de HTTP (lista a un solo canje, determinado por el ID que se indique)
router.get('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const canje = await Canje.findById(req.params.id);
    if (canje){
      res.send(canje);
    } else {
      res.status(404).send(CANJE_NO_EXISTE);
    }
});

// Método para validar los datos del canje que se ingresa (solo para el método POST)
function validar(canje){
  const esquemaValido = Joi.object({
    trajeId: Joi.objectId().required()
  });
  return esquemaValido.validate({ trajeId: canje.trajeId });
}

// Se disponibiliza la ruta de canjes 
module.exports = router; 