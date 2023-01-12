const express = require('express');
const Repartidorpordet = require('../models/repartidorPorDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const repartidorporciondetalles = await Repartidorpordet.find({}).sort({ "nombre": -1 }).limit(25);
  if(repartidorporciondetalles){
    res.send(repartidorporciondetalles);
    console.log('porciones',repartidorporciondetalles)
  }else{
    res.status(404).send({ message: 'Porciondetalles no encontrados' });
    console.log('Porciondetalles no encontrados',repartidorporciondetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('repartidorPorDetRoute get ingredientes', req.body )
  const {repartidorPorId}= req.body
  const repartidorporciondetalles = await Repartidorpordet.find({repartidorPorId:repartidorPorId}).sort({ "nombre": -1 }).limit(25);
  if(repartidorporciondetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorporciondetalles);
    console.log('repartidorPorDetRoute porciones',repartidorporciondetalles)
  }else{
    res.status(404).send({ message: 'Porciondetalles no encontrados' });
    console.log('Porciondetalles no encontrados',repartidorporciondetalles)
  }
});

router.post('/registrar', async (req, res) => {
  console.log('repartidorPorcionDet registrar req.body ',req.body);
  const {porcionId,porcionNombre,familia,repartidorPorId,grupo,rendimiento } = req.body
  
  const oldPorcionPorDet = await Repartidorpordet.findOne({porcionId:porcionId,repartidorPorId:repartidorPorId
})
  if(oldPorcionPorDet){
    console.log('Error: Repartidor Porcion Detalle ya existe oldPorcionPorDet',oldPorcionPorDet);
    res.status(400).send({ message: 'Error: Repartidor Porcion Detalle ya existe.' });
  }else{
    //console.log('oldPorcionPorDet',oldPorcionPorDet);
    const repartidorPorcionDet = new Repartidorpordet({
      porcionId:porcionId,
      porcionNombre:porcionNombre,
      repartidorPorId:repartidorPorId,
      familia:familia,
      grupo:grupo,
      rendimiento:rendimiento,
    });
    const newRepartidorPorcionDet = await repartidorPorcionDet.save();
    if (newRepartidorPorcionDet) {
      console.log('newRepartidorPorcionDet',newRepartidorPorcionDet);
      res.send({
        _id: newRepartidorPorcionDet._id,     
        porcionId: newRepartidorPorcionDet.porcionId,     
        porcionNombre: newRepartidorPorcionDet.porcionNombre,     
        repartidorPorId: newRepartidorPorcionDet.repartidorPorId,     
        familia: newRepartidorPorcionDet.familia,     
        grupo: newRepartidorPorcionDet.grupo,     
        rendimiento: newRepartidorPorcionDet.rendimiento,     
      })
    } else {
      console.log('Datos de Repartidor Detalle invalidos. newRepartidorPorcionDet',newRepartidorPorcionDet);
      res.status(404).send({ message: 'Datos de Repartidor Detalle invalidos.' });
    }
  }
});

module.exports = router;