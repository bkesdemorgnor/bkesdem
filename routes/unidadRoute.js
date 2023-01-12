const express = require('express');
const Unidad = require('../models/unidadModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get Unidad', req )
  const unidades = await Unidad.find({}).sort({ "nombre": -1 }).limit(25);
  if(unidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Unidades no encontradas' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldUnidad = await Unidad.findOne({nombre:req.body.nombre})
  if(oldUnidad){
    res.status(400).send({ message: 'Error: Unidad ya existente.' });
  }else{
    const unidad = new Unidad({
      nombre: req.body.nombre,
      simbolo: req.body.simbolo,
      descripcion: req.body.descripcion,
    });
    const newUnidad = await unidad.save();
    if (newUnidad) {
      console.log('newUnidad',newUnidad);
      res.send({
        _id: newUnidad._id,
        nombre: newUnidad.nombre,
        simbolo: newUnidad.simbolo,
        descripcion: newUnidad.descripcion,
      })
    } else {
      res.status(401).send({ message: 'Datos de Unidad invalidos.' });
    }
  }
});

module.exports = router;