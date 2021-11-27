const jwt = require('jsonwebtoken');
const config = require('config');

// Mensajes
const ACCESO_DENEGADO = 'Acceso denegado. El token no fue generado.';
const TOKEN_INVALIDO = "Token inválido";

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if(token){
    try {
        const decoded = jwt.verify(token, config.get('claveJWTJ'));
        req.jugador = decoded; 
        next();
    }
    catch(e){
        res.status(400).send(TOKEN_INVALIDO);
    }
  } else {
    res.status(401).send(ACCESO_DENEGADO);
  }
}