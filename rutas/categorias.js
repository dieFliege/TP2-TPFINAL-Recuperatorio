const express = require('express');
const router = express.Router();

// Mensaje 
const CATEGORIA_NO_EXISTE = 'No existe ninguna categoría con el ID brindado.';

// Se importa el modelo de la categoría  
const {Categoria} = require('../modelos/categoria');

// Endpoint para método GET de HTTP (lista a todos las categorías) 
router.get('/', async (req, res) => {
    const categorias = await Categoria.find().sort('nombre');
    res.send(categorias);
});

// Endpoint para método POST de HTTP (agrega una categoría)
router.post('/', async (req, res) => {
    let categoria = new Categoria({ nombre: req.body.nombre });
    categoria = await categoria.save();
    res.send(categoria);
});

// Endpoint para método PUT de HTTP (actualiza los datos de la categoría cuyo ID se indique)
router.put('/:id', async (req, res) => {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, { nombre: req.body.nombre }, {
        new: true
      });
      if (categoria){
        res.send(categoria);      
      } else {
        res.status(404).send(CATEGORIA_NO_EXISTE);
      }
});

// Endpoint para método DELETE de HTTP (remueve a la categoría cuyo ID se indique)
router.delete('/:id', async (req, res) => {
    const categoria = await Categoria.findByIdAndRemove(req.params.id);
    if (categoria){
      res.send(categoria);      
    } else {
      res.status(404).send(CATEGORIA_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a una sola categoría, determinada por el ID que se indique)
router.get('/:id', async (req, res) => {
    const categoria = await Categoria.findById(req.params.id);
    if (categoria){
        res.send(categoria);      
      } else {
        res.status(404).send(CATEGORIA_NO_EXISTE);
      }
});

// Se disponibiliza la ruta de la categoría 
module.exports = router;