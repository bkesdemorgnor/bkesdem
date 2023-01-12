const express = require('express');
const Recetadet = require('../models/recetaDetModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const recetaDetalles = await Recetadet.find({}).sort({ "nombre": -1 }).limit(100);
  if(recetaDetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(recetaDetalles);
    console.log('recetaDetalles',recetaDetalles)
  }else{
    res.status(404).send({ message: 'Recetas no encontradas' });
    console.log('Recetas no encontradas',recetaDetalles)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get porcion Id', req.params )
  const {id} = req.params;
  const receta = await Receta.find({}).sort({ "nombre": -1 }).limit(100);
  if(receta){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(receta);
    console.log('receta',receta)
  }else{
    res.status(404).send({ message: 'Receta no encontrada' });
    console.log('Receta no encontrada',receta)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {receta} = req.body
  const recetas = await Recetadet.find({ 'nombre': { $regex: receta, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(recetas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(recetas);
    console.log('recetas',recetas)
  }else{
    res.status(404).send({ message: 'recetas no encontrados' });
    console.log('recetas no encontradas', recetas );
    
  }
});


router.post("/recetaid", isAuth, async (req, res) => {
  console.log('get receta detalles body', req.body )
  const {recetaId} = req.body
  const recetaDetalles = await Recetadet.find({recetaId:recetaId}).sort({ "nombre": -1 }).limit(100);
  if(recetaDetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(recetaDetalles);
    console.log('recetas',recetaDetalles)
  }else{
    res.status(404).send({ message: 'Detalles de receta no encontrados' });
    console.log('Detalles de receta no encontradas', recetaDetalles );
    
  }
});

router.post('/registrar', async (req, res) => {
  var {nombre,itemId,tipoItem,recetaId,cantidad} = req.body;
  console.log('registrar receta detalle body :',req.body);
  if(nombre && itemId && recetaId && cantidad && tipoItem){
    const oldReceta = await Recetadet.findOne({recetaId:recetaId,itemId:itemId})
    if(oldReceta){
      res.status(400).send({ message: 'Error: Detalle de Receta ya existe.' });
    }else{
      const recetaDet = new Recetadet({
          recetaId:recetaId,
          itemId:itemId,
          tipoItem:tipoItem,
          nombre: nombre,
          cantidad: cantidad,
      });
      const newRecetaDet = await recetaDet.save();
      console.log('newReceta',newRecetaDet);
      if (newRecetaDet) {
        res.send({
          _id:newRecetaDet._id,
          recetaId:newRecetaDet.recetaId,
          itemId:newRecetaDet.itemId,
          tipoItem:newRecetaDet.tipoItem,
          nombre:newRecetaDet.nombre,
          cantidad:newRecetaDet.cantidad,
        })
      } else {
        res.status(400).send({ message: 'Datos de Detalle de Receta invalidos.' });
        console.log('Datos de Detalle de Receta invalidos.',newRecetaDet);
      }
    }

  }else{
    res.status(400).send({ message: 'Faltan datos en Registro de Receta Detalles.' });
    console.log('Faltan datos en Registro de Receta Detalles.',req.body);
  }
});

module.exports = router;