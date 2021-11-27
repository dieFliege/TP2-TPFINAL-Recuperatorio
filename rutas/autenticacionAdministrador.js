const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// Se importa el modelo del administrador 
const {Administrador} = require('../modelos/administrador');

// Mensaje
const EMAIL_CONTRASENIA_INVALIDOS = "Email o contraseña inválidos.";

// Endpoint para método POST de HTTP (auntentica a un administrador)
router.post('/', async (req, res) => {
    const { error } = validar(req.body); 
    if(!error){
      let administrador = await Administrador.findOne({ email: req.body.email });
      if(administrador){
          const contraseniaValida = await bcrypt.compare(req.body.contrasenia, administrador.contrasenia);
          if(contraseniaValida){
              res.send(administrador.generateAuthToken());
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

// Método para validar los datos del administrador que se ingresa (solo email y contraseña)
function validar(req) {
  const esquemaValido = Joi.object({
    email: Joi.string().min(7).max(64).required().email(),
    contrasenia: Joi.string().min(5).max(255).required()
  });
  return esquemaValido.validate({ email: req.email, contrasenia: req.contrasenia });
}

module.exports = router;