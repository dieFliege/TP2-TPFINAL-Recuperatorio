const autenticacionAdministrador = require('../middleware/autenticacionAdministrador');
const validacionID = require('../middleware/validacionID');
const express = require('express');
const router = express.Router();

// Se importan los modelos del traje y de la categoría  
const {Traje, validar} = require('../modelos/traje'); 
const {Categoria} = require('../modelos/categoria');

// Mensajes 
const TRAJE_YA_EXISTIA = 'El traje ya existía.';
const CATEGORIA_INVALIDA = 'Categoría inválida.';
const TRAJE_NO_EXISTE = 'No existe ningún traje con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todos los trajes) 
router.get('/', async (req, res) => {
  const trajes = await Traje.find().sort('nombre');
  res.send(trajes);
});

// Endpoint para método POST de HTTP (agrega un traje)
router.post('/', autenticacionAdministrador, async (req, res) => {
    const { error } = validar(req.body);
    if(!error){
        let traje = await Traje.findOne({ nombre: req.body.nombre });
        if(!traje){
            const categoria = await Categoria.findById(req.body.categoriaId);
            if (categoria){
                traje = new Traje({ 
                    nombre: req.body.nombre,
                    categoria: {
                        _id: categoria._id,
                        nombre: categoria.nombre,
                        precio: categoria.precio
                    },
                    primeraAparicion: req.body.primeraAparicion,
                    anioAparicion: req.body.anioAparicion,
                    descripcion: req.body.descripcion,
                    poster: req.body.poster,
                });
                await traje.save();
                res.send(traje);
            } else {
                res.status(400).send(CATEGORIA_INVALIDA);
            }
        } else {
            res.status(400).send(TRAJE_YA_EXISTIA);
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método PUT de HTTP (actualiza los datos del traje cuyo ID se indique)
router.put('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const { error } = validar(req.body);
    if(!error){
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
                  nombre: categoria.nombre,
                  precio: categoria.precio,
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
    } else {
        res.status(400).send(error.details[0].message);
    }
});

// Endpoint para método DELETE de HTTP (remueve al traje cuyo ID se indique)
router.delete('/:id', [autenticacionAdministrador, validacionID], async (req, res) => {
    const traje = await Traje.findByIdAndRemove(req.params.id);
    if(traje){
        res.send(traje);
    } else {
        res.status(404).send(TRAJE_NO_EXISTE);
    }
});

// Endpoint para método GET de HTTP (lista a un solo traje, determinado por el ID que se indique)
router.get('/:id', validacionID, async (req, res) => {
    const traje = await Traje.findById(req.params.id);
    if(traje){
        res.send(traje);
    } else {
        res.status(404).send(TRAJE_NO_EXISTE);
    }
});

// Se disponibiliza la ruta de trajes  
module.exports = router; 