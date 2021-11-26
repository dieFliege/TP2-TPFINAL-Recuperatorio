const express = require('express');
const categorias = require('../rutas/categorias');
const jugadores = require('../rutas/jugadores');
const trajes = require('../rutas/trajes');
const canjes = require('../rutas/canjes');

// Se disponibilizan todas las rutas 
module.exports = function(app) {
  app.use(express.json());
  app.use('/api/categorias', categorias);
  app.use('/api/jugadores', jugadores);
  app.use('/api/trajes', trajes);
  app.use('/api/canjes', canjes);
}