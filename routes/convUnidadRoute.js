const express = require('express');
const Convunidad = require('../models/convUnidadModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get Unidad', req )
  const convUnidades = await Convunidad.find({}).sort({ "nombre": -1 }).limit(25);
  if(convUnidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(convUnidades);
    //console.log('convUnidades',convUnidades)
  }else{
    res.status(404).send({ message: 'Conversor de Unidades no encontrada' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldConvUnidad = await Convunidad.findOne({nombre:req.body.nombre})
  if(oldConvUnidad){
    res.status(400).send({ message: 'Error: Conversor de Unidad ya existe.' });
  }else{
    const convUnidad = new Convunidad({
      nombre: req.body.nombre,
      simbolo: req.body.simbolo,
      descripcion: req.body.descripcion,
      valor: req.body.valor,
    });
    const newConvUnidad = await convUnidad.save();
    if (newConvUnidad) {
      console.log('newConvUnidad',newConvUnidad);
      res.send({
        _id: newConvUnidad._id,
        nombre: newConvUnidad.nombre,
        simbolo: newConvUnidad.simbolo,
        descripcion: newConvUnidad.descripcion,
        valor: newConvUnidad.valor,
      })
    } else {
      res.status(401).send({ message: 'Datos de Conversor de Unidad invalidos.' });
    }
  }
});

module.exports = router;