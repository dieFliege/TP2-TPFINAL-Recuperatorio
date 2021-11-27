const autenticacionAdministrador = require('../middleware/autenticacionAdministrador');
const Joi = require('joi');
const autenticacionJugador = require('../middleware/autenticacionJugador');
const validacionID = require('../middleware/validacionID');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// Mensaje
const JUGADOR_YA_REGISTRADO = 'El jugador ya está registrado.';
const JUGADOR_NO_EXISTE = 'No existe ningún jugador con el ID brindado.';
const PUNTOS_INICIALES = 3000;
const MIN_PUNTOS = 0;
const MAX_PUNTOS = 150000;

// Se importa el modelo del jugador 
const {Jugador, validar} = require('../modelos/jugador'); 

// Endpoint para método GET de HTTP (lista al jugador que está actualmente autenticado) 
router.get('/yo', autenticacionJugador, async (req, res) => {
    const jugador = await Jugador.findById(req.jugador._id).select('-contrasenia');
    res.send(jugador);
  });

// Endpoint para método GET de HTTP (lista a todos los jugadores) 
router.get('/', async (req, res) => {
    const jugador = await Jugador.find().sort('alias');
    res.send(jugador);
});

// Endpoint para método POST de HTTP (agrega un jugador)
router.post('/', async (req, res) => {
    const { error } = validar(req.body);
    if(!error){
        let jugador = await Jugador.findOne({ alias: req.body.alias });
        if(!jugador){
            // En este caso no utilizo lodash porque los puntos no están el request HTTP
            jugador = new Jugador({ 
                alias: req.body.alias,
                contrasenia: req.body.contrasenia,
                puntos: PUNTOS_INICIALES,
                trajesCanjeados: []
            });
            const salt = await bcrypt.genSalt(10);
            jugador.contrasenia = await bcrypt.hash(jugador.contrasenia, salt);
            await jugador.save();
            const token = jugador.generateAuthToken();
            res.header('x-auth-token', token).send(_.pick(jugador, ['_id', 'alias', 'puntos']));
        } else {
            res.status(400).send(JUGADOR_YA_REGISTRADO);
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método PUT de HTTP (actualiza los datos del jugador cuyo ID se indique)
router.put('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const { error } = validarPUT(req.body);
    if(!error){
        const jugador = await Jugador.findByIdAndUpdate(req.params.id,
            { 
              puntos: req.body.puntos
            }, { new: true });
          if (jugador){
              res.send(_.pick(jugador, ['_id', 'alias', 'puntos']));
          } else {
              res.status(404).send(JUGADOR_NO_EXISTE);
          }
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método DELETE de HTTP (remueve al jugador cuyo ID se indique)
router.delete('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const jugador = await Jugador.findByIdAndRemove(req.params.id);
    if (jugador){
        res.send(jugador);
    } else {
        res.status(404).send(JUGADOR_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a un solo jugador, determinado por el ID que se indique)
router.get('/:id', validacionID, async (req, res) => {
    const jugador = await Jugador.findById(req.params.id);
    if (jugador){
        res.send(jugador);
    } else {
        res.status(404).send(JUGADOR_NO_EXISTE);
    }
});

// Método para validar los datos del jugador que se ingresa (para el método PUT)
function validarPUT(jugador) {
    const esquemaValido = Joi.object({
        alias: Joi.number().min(MIN_PUNTOS).max(MAX_PUNTOS)
    });
    return esquemaValido.validate({ alias: jugador.alias });
}

// Se disponibiliza la ruta de jugadores 
module.exports = router; 