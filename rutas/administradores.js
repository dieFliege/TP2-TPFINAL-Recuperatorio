const autentication = require('../middleware/autenticacionAdministrador');
const bcrypt = require('bcrypt');

// Utilizamos el módulo lodash, para manipular objetos 
const _ = require('lodash');

const express = require('express');
const router = express.Router();

// Se importan el modelo del administrador y el método de validación de los datos ingresados
const {Administrador, validar} = require('../modelos/administrador');

// Mensaje 
const ADMINISTRADOR_YA_REGISTRADO = 'El administrador ya está registrado';

// Endpoint para método GET de HTTP (lista al administrador que está actualmente autenticado) 
router.get('/yo', autentication, async (req, res) => {
  const administrador = await Administrador.findById(req.administrador._id).select('-contrasenia');
  res.send(administrador);
});

// Endpoint para método POST de HTTP (registra un administrador)
router.post('/', async (req, res) => {
  const { error } = validar(req.body);
  if(!error){
    let administrador = await Administrador.findOne({ email: req.body.email });
    if(!administrador){
        administrador = new Administrador(_.pick(req.body, ['nombre', 'email', 'contrasenia']));
        // Creamos un String random de 10 carácteres, para agregar a la contraseña
        const salt = await bcrypt.genSalt(10);
        // Encriptamos la contraseña 
        administrador.contrasenia = await bcrypt.hash(administrador.contrasenia, salt);
        await administrador.save();
        // Generamos el token, el cual luego deberá ser pasado en el header 'x-auth-token'
        const token = administrador.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(administrador, ['_id', 'nombre', 'email']));  
    } else {
        res.status(400).send(ADMINISTRADOR_YA_REGISTRADO);
    }
  } else {
    res.status(400).send(error.details[0].message);
  }
});

module.exports = router; 