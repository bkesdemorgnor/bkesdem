const express = require('express');
const Formuladet = require('../models/formulaDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const formuladetalles = await Formuladet.find({}).sort({ "nombre": -1 }).limit(25);
  if(formuladetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formuladetalles);
    //console.log('formulas',formuladetalles)
  }else{
    res.status(404).send({ message: 'Formuladetalles no encontrados' });
    console.log('Formuladetalles no encontrados',formuladetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('formulaDetRoute get ingredientes', req.body )
  const {formulaId}= req.body
  const formuladetalles = await Formuladet.find({formulaId:formulaId}).sort({ "nombre": -1 }).limit(25);
  if(formuladetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formuladetalles);
    //console.log('formulas',formuladetalles)
  }else{
    res.status(404).send({ message: 'Formuladetalles no encontrados' });
    console.log('Formuladetalles no encontrados',formuladetalles)
  }
});

router.post('/registrar', async (req, res) => {
  console.log('formulaDet registrar req.body ',req.body);
  const {formulaId,nombreId,area,kardextipo,nombre,cantidad,unidad,isRepartoGrupo } = req.body
  console.log('formulaId',formulaId);
  console.log('nombreId',nombreId);
  
  const oldFormulaDet = await Formuladet.findOne({formulaId:formulaId,nombreId:nombreId})
  if(oldFormulaDet){
    console.log('Error: Formula Detalle ya existe oldFormulaDet',oldFormulaDet);
    res.status(400).send({ message: 'Error: Formula Detalle ya existe.' });
  }else{
    //console.log('oldFormulaDet',oldFormulaDet);
    const formulaDet = new Formuladet({
      formulaId:formulaId,
      nombreId:nombreId,
      area:area,
      kardextipo:kardextipo,
      nombre:nombre,
      cantidad:cantidad,
      unidad:unidad,
      isRepartoGrupo:isRepartoGrupo,
    });
    const newFormulaDet = await formulaDet.save();
    if (newFormulaDet) {
      console.log('newFormulaDet',newFormulaDet);
      res.send({
        _id:newFormulaDet._id,     
        formulaId:newFormulaDet.formulaId,     
        nombreId:newFormulaDet.nombreId,     
        area:newFormulaDet.area,     
        kardextipo:newFormulaDet.kardextipo,     
        nombre:newFormulaDet.nombre,     
        cantidad:newFormulaDet.cantidad,     
        unidad:newFormulaDet.unidad,     
        isRepartoGrupo:newFormulaDet.isRepartoGrupo,     
      })
    } else {
      console.log('Datos de Formula Detalle invalidos. newFormulaDet',newFormulaDet);
      res.status(401).send({ message: 'Datos de Formula Detalle invalidos.' });
    }
  }
});

module.exports = router;