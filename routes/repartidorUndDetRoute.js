const express = require('express');
const Repartidorunddet = require('../models/repartidorUndDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const repartidorunidadesdetalles = await Repartidorunddet.find({}).sort({ "nombre": -1 }).limit(25);
  if(repartidorunidadesdetalles){
    res.send(repartidorunidadesdetalles);
    console.log('unidades',repartidorunidadesdetalles)
  }else{
    res.status(404).send({ message: 'Unidadesdetalles no encontrados' });
    console.log('Unidadesdetalles no encontrados',repartidorunidadesdetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('repartidorUndDetRoute get ingredientes', req.body )
  const {repartidorUndId}= req.body
  const repartidorunidadesdetalles = await Repartidorunddet.find({repartidorUndId:repartidorUndId}).sort({ "nombre": -1 }).limit(25);
  if(repartidorunidadesdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorunidadesdetalles);
    console.log('repartidorUndDetRoute unidades',repartidorunidadesdetalles)
  }else{
    res.status(404).send({ message: 'Unidadesdetalles no encontrados' });
    console.log('Unidadesdetalles no encontrados',repartidorunidadesdetalles)
  }
});

router.post('/registrar', async (req, res) => {
  console.log('repartidorUnidadesDet registrar req.body ',req.body);
  const {unidadesId,unidadesNombre,familias,repartidorUndId,grupo,rendimiento } = req.body
  
  const oldUnidadesUndDet = await Repartidorunddet.findOne({unidadesId:unidadesId,repartidorUndId:repartidorUndId
})
  if(oldUnidadesUndDet){
    console.log('Error: Repartidor unidades Detalle ya existe oldUnidadesUndDet',oldUnidadesUndDet);
    res.status(400).send({ message: 'Error: Repartidor unidades Detalle ya existe.' });
  }else{
    //console.log('oldUnidadesUndDet',oldUnidadesUndDet);
    const repartidorUnidadesDet = new Repartidorunddet({
      unidadesId:unidadesId,
      unidadesNombre:unidadesNombre,
      repartidorUndId:repartidorUndId,
      familias:familias,
      grupo:grupo,
      rendimiento:rendimiento,
    });
    const newRepartidorUnidadesDet = await repartidorUnidadesDet.save();
    if (newRepartidorUnidadesDet) {
      console.log('newRepartidorUnidadesDet',newRepartidorUnidadesDet);
      res.send({
        _id: newRepartidorUnidadesDet._id,     
        unidadesId: newRepartidorUnidadesDet.unidadesId,     
        unidadesNombre: newRepartidorUnidadesDet.unidadesNombre,     
        repartidorUndId: newRepartidorUnidadesDet.repartidorUndId,     
        familias: newRepartidorUnidadesDet.familias,     
        grupo: newRepartidorUnidadesDet.grupo,     
        rendimiento: newRepartidorUnidadesDet.rendimiento,     
      })
    } else {
      console.log('Datos de Repartidor Detalle invalidos. newRepartidorUnidadesDet',newRepartidorUnidadesDet);
      res.status(404).send({ message: 'Datos de Repartidor Detalle invalidos.' });
    }
  }
});

module.exports = router;