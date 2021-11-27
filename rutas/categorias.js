const Joi = require('joi');
const autenticacionAdministrador = require('../middleware/autenticacionAdministrador');
const validacionID = require('../middleware/validacionID');
const express = require('express');
const router = express.Router();

// Mensaje 
const CATEGORIA_YA_EXISTIA = 'La categoría ya existía.';
const CATEGORIA_NO_EXISTE = 'No existe ninguna categoría con el ID brindado.';

const PRECIO_MIN = 1000;
const PRECIO_MAX = 10000;

// Se importa el modelo de la categoría  
const {Categoria, validar} = require('../modelos/categoria');

// Endpoint para método GET de HTTP (lista a todos las categorías) 
router.get('/', async (req, res) => {
    const categorias = await Categoria.find().sort('nombre');
    res.send(categorias);
});

// Endpoint para método POST de HTTP (agrega una categoría)
router.post('/', autenticacionAdministrador, async (req, res) => {
  const { error } = validar(req.body);
  if(!error){
    let categoria = await Categoria.findOne({ nombre: req.body.nombre });
    if(!categoria){
      categoria = new Categoria({ nombre: req.body.nombre, precio: req.body.precio });
      categoria = await categoria.save();
      res.send(categoria);
    } else {
      res.status(400).send(CATEGORIA_YA_EXISTIA);
    }
  } else {
    res.status(400).send(error.details[0].message);
  }
});

// Endpoint para método PUT de HTTP (actualiza los datos de la categoría cuyo ID se indique)
router.put('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
  const { error } = validarPUT(req.body);
  if(!error){
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, { precio: req.body.precio }, {
      new: true
    });
    if (categoria){
      res.send(categoria);
    } else {
      res.status(404).send(CATEGORIA_NO_EXISTE);
    }
  } else {
    res.status(400).send(error.details[0].message);
  }
});

// Endpoint para método DELETE de HTTP (remueve a la categoría cuyo ID se indique)
router.delete('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const categoria = await Categoria.findByIdAndRemove(req.params.id);
    if (categoria){
      res.send(categoria);      
    } else {
      res.status(404).send(CATEGORIA_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a una sola categoría, determinada por el ID que se indique)
router.get('/:id', validacionID, async (req, res) => {
    const categoria = await Categoria.findById(req.params.id);
    if (categoria){
        res.send(categoria);      
      } else {
        res.status(404).send(CATEGORIA_NO_EXISTE);
      }
});

// Método para validar los datos de la categoria que se ingresa (para el método PUT)
function validarPUT(categoria) {
  const esquemaValido = Joi.object({
    precio: Joi.number().min(PRECIO_MIN).max(PRECIO_MAX).required()
  });
  return esquemaValido.validate({ precio: categoria.precio });
}

// Se disponibiliza la ruta de la categoría 
module.exports = router;