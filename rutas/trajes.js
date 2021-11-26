const express = require('express');
const router = express.Router();

// Se importan los modelos del traje y de la categoría  
const {Traje} = require('../modelos/traje'); 
const {Categoria} = require('../modelos/categoria');

// Mensajes 
const CATEGORIA_INVALIDA = 'Categoría inválida.';
const TRAJE_NO_EXISTE = 'No existe ningún traje con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todos los trajes) 
router.get('/', async (req, res) => {
  const trajes = await Traje.find().sort('nombre');
  res.send(trajes);
});

// Endpoint para método POST de HTTP (agrega un traje)
router.post('/', async (req, res) => {
    const categoria = await Categoria.findById(req.body.categoriaId);
    if (categoria){
      const traje = new Traje({ 
          nombre: req.body.nombre,
          primeraAparicion: req.body.primeraAparicion,
          anioAparicion: req.body.anioAparicion,
          descripcion: req.body.descripcion,
          poster: req.body.poster,
          categoria: {
            _id: categoria._id,
            nombre: categoria.nombre
          }
        });
        await traje.save();
        res.send(traje);
    } else {
      res.status(400).send(CATEGORIA_INVALIDA);
    }
});

// Endpoint para método PUT de HTTP (actualiza los datos del traje cuyo ID se indique)
router.put('/:id', async (req, res) => {
    const categoria = await Categoria.findById(req.body.categoriaId);
    if(categoria){
        const traje = await Traje.findByIdAndUpdate(req.params.id, 
        {
            nombre: req.body.nombre,
            primeraAparicion: req.body.primeraAparicion,
            anioAparicion: req.body.anioAparicion,
            descripcion: req.body.descripcion,
            poster: req.body.poster,
            categoria: {
              _id: categoria._id,
              nombre: categoria.nombre
            }
        }, {new: true});
        if(traje){ 
            res.send(traje); 
        } else {
            res.status(404).send(TRAJE_NO_EXISTE);
        }
    } else {
        res.status(400).send(CATEGORIA_INVALIDA);
    }
});

// Endpoint para método DELETE de HTTP (remueve al traje cuyo ID se indique)
router.delete('/:id', async (req, res) => {
    const traje = await Traje.findByIdAndRemove(req.params.id);
    if(traje){
        res.send(traje);
    } else {
        res.status(404).send(TRAJE_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a un solo traje, determinado por el ID que se indique)
router.get('/:id', async (req, res) => {
    const traje = await Traje.findById(req.params.id);
    if(traje){
        res.send(traje);
    } else {
        res.status(404).send(TRAJE_NO_EXISTE);
    }
});

// Se disponibiliza la ruta de trajes  
module.exports = router; 