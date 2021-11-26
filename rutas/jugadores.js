const express = require('express');
const router = express.Router();

// Mensaje
const JUGADOR_NO_EXISTE = 'No existe ningún jugador con el ID brindado.';
const PUNTOS_INICIALES = 3000;

// Se importa el modelo del jugador 
const {Jugador, validar} = require('../modelos/jugador'); 

// Endpoint para método GET de HTTP (lista a todos los jugadores) 
router.get('/', async (req, res) => {
    const jugador = await Jugador.find().sort('alias');
    res.send(jugador);
});

// Endpoint para método POST de HTTP (agrega un jugador)
router.post('/', async (req, res) => {
    const { error } = validar(req.body);
    if(!error){
        let jugador = new Jugador({ 
            alias: req.body.alias,
            contrasenia: req.body.contrasenia,
            puntos: PUNTOS_INICIALES
          });
          jugador = await jugador.save();
          res.send(jugador);
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método PUT de HTTP (actualiza los datos del jugador cuyo ID se indique)
router.put('/:id', async (req, res) => {
    const { error } = validar(req.body);
    if(!error){
        const jugador = await Jugador.findByIdAndUpdate(req.params.id,
            { 
              alias: req.body.alias,
              puntos: req.body.puntos
            }, { new: true });
          if (jugador){
              res.send(jugador);
          } else {
              res.status(404).send(JUGADOR_NO_EXISTE);
          }
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método DELETE de HTTP (remueve al jugador cuyo ID se indique)
router.delete('/:id', async (req, res) => {
    const jugador = await Jugador.findByIdAndRemove(req.params.id);
    if (jugador){
        res.send(jugador);
    } else {
        res.status(404).send(JUGADOR_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a un solo jugador, determinado por el ID que se indique)
router.get('/:id', async (req, res) => {
    const jugador = await Jugador.findById(req.params.id);
    if (jugador){
        res.send(jugador);
    } else {
        res.status(404).send(JUGADOR_NO_EXISTE);
    }
});

// Se disponibiliza la ruta de jugadores 
module.exports = router; 