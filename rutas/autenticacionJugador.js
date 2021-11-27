const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// Se importa el modelo del administrador 
const {Jugador} = require('../modelos/jugador');

// Mensaje
const EMAIL_CONTRASENIA_INVALIDOS = "Alias o contraseña inválidos.";

// Endpoint para método POST de HTTP (auntentica a un jugador)
router.post('/', async (req, res) => {
    const { error } = validar(req.body); 
    if(!error){
      let jugador = await Jugador.findOne({ alias: req.body.alias });
      if(jugador){
          const contraseniaValida = await bcrypt.compare(req.body.contrasenia, jugador.contrasenia);
          if(contraseniaValida){
              res.send(jugador.generateAuthToken());
          } else {
              res.status(400).send(EMAIL_CONTRASENIA_INVALIDOS);
          }
      } else {
          res.status(400).send(EMAIL_CONTRASENIA_INVALIDOS);
      }
    } else {
      res.status(400).send(error.details[0].message);
    }
});

// Método para validar los datos del jugador que se ingresa (solo email y contraseña)
function validar(req) {
  const esquemaValido = Joi.object({
    alias: Joi.string().min(5).max(32).required(),
    contrasenia: Joi.string().min(5).max(255).required()
  });

  return esquemaValido.validate({ alias: req.alias, contrasenia: req.contrasenia });
}

module.exports = router;