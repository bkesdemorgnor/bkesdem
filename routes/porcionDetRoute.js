const express = require('express');
const Porciondet = require('../models/porcionDetModel');
const Porcion = require('../models/porcionModel');
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

/* Api que busca todos los ingredientes de una Porcion 
  parametros de entrada:
    porcionId
*/
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

/* Api que busca un ingrediente de Una Porcion
  parametros de entrada:
    porcionId
    unidadesId
*/
router.post("/ingrediente", isAuth, async (req, res) => {
  console.log('porcionDetRoute get ingrediente', req.body )
  const {porcionId,unidadesId}= req.body
  const porciondetalle = await Porciondet.findOne({porcionId:porcionId,unidadesId:unidadesId}).sort({ "nombre": -1 }).limit(25);
  if(porciondetalle){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciondetalle);
    console.log('porciones',porciondetalle)
  }else{
    res.status(404).send({ message: 'Porciondetalle no encontrados' });
    console.log('Porciondetalle no encontrados',porciondetalle)
  }
});

/* Api que busca todos los ingredientes de una Porcion 
  parametros de entrada:
    lote -> contiene [{porcionId:porcionId1,unidadesId:unidadesId1},{porcionId:porcionId2,unidadesId:unidadesId2}...etc]
*/
router.post("/ingredienteslote", isAuth, async (req, res) => {
  console.log('porcionDetRoute get ingredienteslote', req.body )
  const {lote}= req.body
  const porciondetalles = await Porciondet.find({$or:lote}).sort({ "nombre": -1 }).limit(200);
  if(porciondetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciondetalles);
    console.log('porciones detalles',porciondetalles)
  }else{
    res.status(404).send({ message: 'Lote de Porciondetalles no encontrados' });
    console.log('Lote de Porciondetalles no encontrados',porciondetalles)
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
     // Fourth Stage
     {
      $lookup:{
        from: "unidades",       // other table name
        localField: "productoId",   // name of users table field
        foreignField: "unidadesId", // name of userinfo table field
        as: "unidades"         // alias for userinfo table
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

/* API que trae los registros de todas las porciones solicitadas con el join de sus Porcion Detalles 
  Parametros de entrada:
    porciones --> lote de todas las porciones requeridas
*/

router.post("/porcionlote", isAuth, async (req, res) => {
  console.log('porcionDetRoute get porcionlote', req.body )
  const {porciones}= req.body
  console.log('porciones',porciones);
  var porcionesdetalles = await Porcion.aggregate([
    // First Stage
     {
     $match : { $or: porciones }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "porciondets",       // other table name
             localField: "porcionId",   // name of users table field
             foreignField: "porcionId", // name of userinfo table field
             as: "porciondetalles"         // alias for userinfo table
         }
     },
  
    // Second Stage
   
    // Third Stage
    
  ])

  console.log('porcionesdetalles',porcionesdetalles);
  console.log('porcionesdetalles.length',porcionesdetalles.length);
  if(Object.entries(porcionesdetalles).length !== 0){
      console.log('porcionesdetalles',porcionesdetalles);
      res.send({
        porcionesdetalles       
      })
  }else{
      console.log('Datos de Porciones Detalles invalidos.',porcionesdetalles);
      res.status(404).send({ message: 'Porcion Detalles, porcion No EXISTE.'});
  }
});

/* Consulta de lote de Porciones join con porcionesdetalle
Parametros de entrada:
  unidades : [unidadesId:unidadesId1,unidadesId:unidadesId2 ......
 */
router.post("/porcionesdetlote", isAuth, async (req, res) => {
  console.log('get porciones porcionesdetlote', req.body )
  const {unidades}= req.body
  console.log('unidades',unidades);
  var porcionesDetalles = await Porciondet.aggregate([
    // First Stage
    {
      $match : { $or: unidades }
    },
    // Join with user_info table
    {
      $lookup:{
        from: "porcions",       // other table name
        localField: "porcionId",   // name of users table field
        foreignField: "porcionId", // name of userinfo table field
        as: "porciones"         // alias for userinfo table
      }
    },
    // Second Stage
  ])
          
  console.log('Porciones Detalles object.length',Object.entries(porcionesDetalles).length);
  if(Object.entries(porcionesDetalles).length !== 0){
    console.log('porcionesDetalles',porcionesDetalles);
    res.send({
      porcionesDetalles       
    })
  }else{
    console.log('Datos de Porciones Detalles invalidos. ',porcionesDetalles);
    res.status(404).send({ message: 'Porciones, detalle No EXISTE'});
  }
});
        
    

router.post('/registrar', async (req, res) => {
  console.log('porcionDet registrar req.body ',req.body);
  const {porcionId,unidadesId,familias,productoId,area,unidadesNombre,unidadesCantidad,unidadesUnidad,tipo,
    unidadesFormula,unidadesReparto,isUnidadesAltRep,unidadesIdAltRep,productoIdAltRep,unidadesNombreAltRep,unidadesCantidadAltRep,
    unidadesRepartoAltRep,ingredienteNombre,ingredienteCantidad,ingredienteUnidad,ingredienteFormula,isEnvioGrupal } = req.body
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
      tipo:tipo,
      area:area,
      familias:familias,
      unidadesNombre:unidadesNombre,
      unidadesCantidad:unidadesCantidad,
      unidadesUnidad:unidadesUnidad,
      unidadesFormula:unidadesFormula,
      unidadesReparto:unidadesReparto,
      isUnidadesAltRep:isUnidadesAltRep,
      unidadesIdAltRep:unidadesIdAltRep,
      productoIdAltRep:productoIdAltRep,
      unidadesNombreAltRep:unidadesNombreAltRep,
      unidadesCantidadAltRep:unidadesCantidadAltRep,
      unidadesRepartoAltRep:unidadesRepartoAltRep,
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
        _id: newPorcionDet._id,
        porcionId: newPorcionDet.porcionId,
        unidadesId: newPorcionDet.unidadesId,
        productoId: newPorcionDet.productoId,
        tipo: newPorcionDet.tipo,
        familias: newPorcionDet.familias,
        unidadesNombre: newPorcionDet.unidadesNombre,
        unidadesCantidad: newPorcionDet.unidadesCantidad,
        unidadesUnidad: newPorcionDet.unidadesUnidad,
        unidadesFormula: newPorcionDet.unidadesFormula,
        unidadesReparto: newPorcionDet.unidadesReparto,
        isUnidadesAltRep: newPorcionDet.isUnidadesAltRep,
        unidadesIdAltRep: newPorcionDet.unidadesIdAltRep,
        productoIdAltRep: newPorcionDet.productoIdAltRep,
        unidadesNombreAltRep: newPorcionDet.unidadesNombreAltRep,
        unidadesCantidadAltRep: newPorcionDet.unidadesCantidadAltRep,
        unidadesRepartoAltRep: newPorcionDet.unidadesRepartoAltRep,
        isEnvioGrupal: newPorcionDet.isEnvioGrupal,
        ingredienteNombre: newPorcionDet.ingredienteNombre,
        ingredienteCantidad: newPorcionDet.ingredienteCantidad,
        ingredienteUnidad: newPorcionDet.ingredienteUnidad,
        ingredienteFormula: newPorcionDet.ingredienteFormula,
        
      })
    } else {
      console.log('Datos de Porcion Detalle invalidos. newPorcionDet',newPorcionDet);
      res.status(401).send({ message: 'Datos de Porcion Detalle invalidos.' });
    }
  }
});

module.exports = router;