const express = require('express');
const router = express.Router();

// Se importan los modelos del canje, el traje y del jugador  
const {Canje, fechaDeCanje} = require('../modelos/canje'); 
const {Traje} = require('../modelos/traje'); 
const {Jugador} = require('../modelos/jugador'); 

// Mensajes 
const JUGADOR_INVALIDO = 'Jugador inválido.';
const TRAJE_INVALIDO = 'Traje inválido.';
const CANJE_NO_EXISTE = 'No existe ningún canje con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todos los canjes) 
router.get('/', async (req, res) => {
  const canjes = await Canje.find();
  res.send(canjes);
});

// Endpoint para método POST de HTTP (agrega un canje)
router.post('/', async (req, res) => {
    const jugador = await Jugador.findById(req.body.jugadorId);
    if (jugador){
      const traje = await Traje.findById(req.body.trajeId);
      if(traje){
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
          await canje.save();
          res.send(canje);
      } else {
          res.status(400).send(TRAJE_INVALIDO);
      }
    } else {
        res.status(400).send(JUGADOR_INVALIDO);
    }
});

// Endpoint para método GET de HTTP (lista a un solo canje, determinado por el ID que se indique)
router.get('/:id', async (req, res) => {
    const canje = await Canje.findById(req.params.id);
    if (canje){
      res.send(canje);
    } else {
      res.status(404).send(CANJE_NO_EXISTE);
    }
});

// Se disponibiliza la ruta de canjes 
module.exports = router; 