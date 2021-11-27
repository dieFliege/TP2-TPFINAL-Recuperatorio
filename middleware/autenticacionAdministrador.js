const jwt = require('jsonwebtoken');
const config = require('config');

// Mensajes
const ACCESO_DENEGADO = 'Acceso denegado. El token no fue generado.';
const TOKEN_INVALIDO = "Token inválido";

// Se disponibiliza el middleware para validar el token del administrador, durante el proceso de autenticación 
module.exports = function (req, res, next) {
  // El token generado lo guardamos en el header 'x-auth-token'
  const token = req.header('x-auth-token');
  if(token){
    try {
        const decoded = jwt.verify(token, config.get('claveJWT'));
        req.administrador = decoded; 
        next();
    }
    catch(e){
        res.status(400).send(TOKEN_INVALIDO);
    }
  } else {
    res.status(401).send(ACCESO_DENEGADO);
  }
}