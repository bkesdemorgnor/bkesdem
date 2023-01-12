const express = require('express');
const Cecomercial = require('../models/cecomercialModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get cecomerciales', req.body )
  const cecomerciales = await Cecomercial.find({}).sort({ "nombre": -1 }).limit(25);
  if(cecomerciales){
    res.send(cecomerciales);
    console.log('cecomerciales',cecomerciales)
  }else{
    res.status(404).send({ message: 'Centro Comerciales no encontradas' });
    console.log('cecomerciales vacio',cecomerciales)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  const {nombre,nickname,descripcion} = req.body;

  const oldCecomercial = await Cecomercial.findOne({nombre:nombre})
  if(oldCecomercial){
    res.status(400).send({ message: 'Error: Centro Comercial ya existente.' });
  }else{
    const cecomercial = new Cecomercial({
      nombre: nombre,
      nickname: nickname,
      descripcion: descripcion,
    });
    const newCecomercial = await cecomercial.save();
    if (newCecomercial) {
      console.log('newCecomercial',newCecomercial);
      res.send({
        _id: newCecomercial._id,
        nombre: newCecomercial.nombre,
        nickname: newCecomercial.nickname,
        descripcion: newCecomercial.descripcion,
      })
    } else {
      res.status(401).send({ message: 'Centro Comercial invalidos.' });
    }
  }
});

module.exports = router;