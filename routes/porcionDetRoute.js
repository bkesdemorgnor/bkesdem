const express = require('express');
const Porciondet = require('../models/porcionDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const porciondetalles = await Porciondet.find({}).sort({ "nombre": -1 }).limit(25);
  if(porciondetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciondetalles);
    console.log('porciones',porciondetalles)
  }else{
    res.status(404).send({ message: 'Porciondetalles no encontrados' });
    console.log('Porciondetalles no encontrados',porciondetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('porcionDetRoute get ingredientes', req.body )
  const {porcionId}= req.body
  const porciondetalles = await Porciondet.find({porcionId:porcionId}).sort({ "nombre": -1 }).limit(25);
  if(porciondetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciondetalles);
    console.log('porciones',porciondetalles)
  }else{
    res.status(404).send({ message: 'Porciondetalles no encontrados' });
    console.log('Porciondetalles no encontrados',porciondetalles)
  }
});


router.post("/grupounidades", isAuth, async (req, res) => {
  console.log('porcionDetRoute get grupounidades', req.body )
  const {unidadesId}= req.body
  const porciondetalles = await Porciondet.find({unidadesId:unidadesId}).sort({ "nombre": -1 }).limit(25);
  if(porciondetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciondetalles);
    console.log('porciones',porciondetalles)
  }else{
    res.status(404).send({ message: 'Porciondetalles no encontrados' });
    console.log('Porciondetalles no encontrados',porciondetalles)
  }
});


/*  Esta funcion trae el lote de los registros de todos las porcioness que vienen en el arreglo porciones
    del join entre Porcion Detalles y Kardex
*/

router.post("/kardexlote", isAuth, async (req, res) => {
  console.log('porcionDetRoute get kardexlote', req.body )
  const {porciones}= req.body
  console.log('porciones',porciones);
  var porcionkardexs = await Porciondet.aggregate([
    // First Stage
     {
     $match : { $or: porciones }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "kardexes",       // other table name
             localField: "porcionId",   // name of users table field
             foreignField: "nombreId", // name of userinfo table field
             as: "porcion_kdx"         // alias for userinfo table
         }
     },
  
    // Second Stage
    {
      $lookup:{
        from: "porcions",       // other table name
        localField: "porcionId",   // name of users table field
        foreignField: "porcionId", // name of userinfo table field
        as: "porciones"         // alias for userinfo table
      }
    },
    // Third Stage
    {
      $lookup:{
        from: "productos",       // other table name
        localField: "productoId",   // name of users table field
        foreignField: "productoId", // name of userinfo table field
        as: "productos"         // alias for userinfo table
      }
    },
  ])

  console.log('porcionkardexs',porcionkardexs);
  console.log('porcionkardexs.length',porcionkardexs.length);
  if(Object.entries(porcionkardexs).length !== 0){
      console.log('porcionkardexs',porcionkardexs);
      res.send({
        porcionkardexs       
      })
  }else{
      console.log('Datos de Porciones Kardex invalidos.',porcionkardexs);
      res.status(404).send({ message: 'Ingrediente, porcion No EXISTE en KARDEX.'});
  }
});


router.post('/registrar', async (req, res) => {
  console.log('porcionDet registrar req.body ',req.body);
  const {porcionId,unidadesId,familia,productoId,area,unidadesNombre,unidadesCantidad,unidadesUnidad,
    unidadesFormula,unidadesReparto,ingredienteNombre,ingredienteCantidad,ingredienteUnidad,ingredienteFormula,
    isEnvioGrupal } = req.body
  console.log('porcionId',porcionId);
  console.log('productoId',productoId);
  console.log('unidadesId',unidadesId);
  
  const oldPorcionDet = await Porciondet.findOne({porcionId:porcionId,unidadesId:unidadesId})
  if(oldPorcionDet){
    console.log('Error: Porcion Detalle ya existe oldPorcionDet',oldPorcionDet);
    res.status(400).send({ message: 'Error: Porcion Detalle ya existe.' });
  }else{
    //console.log('oldPorcionDet',oldPorcionDet);
    const porcionDet = new Porciondet({
      porcionId:porcionId,
      unidadesId:unidadesId,
      productoId:productoId,
      area:area,
      familia:familia,
      unidadesNombre:unidadesNombre,
      unidadesCantidad:unidadesCantidad,
      unidadesUnidad:unidadesUnidad,
      unidadesFormula:unidadesFormula,
      unidadesReparto:unidadesReparto,
      isEnvioGrupal:isEnvioGrupal,
      ingredienteNombre:ingredienteNombre,
      ingredienteCantidad:ingredienteCantidad,
      ingredienteUnidad:ingredienteUnidad,
      ingredienteFormula:ingredienteFormula,
    });
    const newPorcionDet = await porcionDet.save();
    if (newPorcionDet) {
      console.log('newPorcionDet',newPorcionDet);
      res.send({
        newPorcionDet       
      })
    } else {
      console.log('Datos de Porcion Detalle invalidos. newPorcionDet',newPorcionDet);
      res.status(401).send({ message: 'Datos de Porcion Detalle invalidos.' });
    }
  }
});

module.exports = router;