const express = require('express');
const Unidadesdet = require('../models/unidadesDetModel');
const Porciondet = require('../models/porcionDetModel');

const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const unidadesdetalles = await Unidadesdet.find({}).sort({ "nombre": -1 }).limit(25);
  if(unidadesdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidadesdetalles);
    console.log('unidadesdetalles',unidadesdetalles)
  }else{
    res.status(404).send({ message: 'Unidadesdetalles no encontrados' });
    console.log('Unidadesdetalles no encontrados',unidadesdetalles)
  }
});

// API que retorna todos los registros de Unidades Detalle con el campo unidadesId solicitado
router.post("/unidades", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get unidades', req.body )
  const {unidadesId}= req.body
  const unidadesdetalles = await Unidadesdet.find({unidadesId:unidadesId}).sort({ "nombre": -1 }).limit(25);
  if(unidadesdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidadesdetalles);
    console.log('unidadesdetalles',unidadesdetalles)
  }else{
    res.status(404).send({ message: 'Unidadesdetalles no encontrados' });
    console.log('Unidadesdetalles no encontrados',unidadesdetalles)
  }
});

// API que retorna todos los registros de Unidades Detalle con el campo productoId solicitado
router.post("/grupoproducto", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get unidades', req.body )
  const {productoId}= req.body
  const unidadesdetalles = await Unidadesdet.find({productoId:productoId}).sort({ "nombre": -1 }).limit(25);
  if(unidadesdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidadesdetalles);
    console.log('unidadesdetalles',unidadesdetalles)
  }else{
    res.status(404).send({ message: 'Unidadesdetalles no encontrados' });
    console.log('Unidadesdetalles no encontrados',unidadesdetalles)
  }
});


/*  Esta funcion trae de primera intencion los registros del join entre Ingredientes Detalles y Kardex
    En caso que no encuentre trae los registros del join entre Porcion Detalles y Kardex
*/

router.post("/kardexs", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get kardexs', req.body )
  const {productoId}= req.body
  console.log('productoId',productoId);
  var ingredientekardexs = await Unidadesdet.aggregate([
    // First Stage
     {
     $match : { "productoId": productoId }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "kardexes",       // other table name
             localField: "unidadesId",   // name of users table field
             foreignField: "nombreId", // name of userinfo table field
             as: "ingrediente_kdx"         // alias for userinfo table
         }
     },
  
   // Second Stage
   
  ])

  console.log('ingredientekardexs',ingredientekardexs);
  console.log('ingredientekardexs.length',ingredientekardexs.length);
  console.log('ingredientekardexs object.length',Object.entries(ingredientekardexs).length);
  if(Object.entries(ingredientekardexs).length !== 0){
      console.log('ingredientekardexs',ingredientekardexs);
      res.send({
        ingredientekardexs       
      })
  }else{

    var ingredientekardexs = await Porciondet.aggregate([
      // First Stage
       {
       $match : { "productoId": productoId }
       },
     
      // Join with user_info table
       {
           $lookup:{
               from: "kardexes",       // other table name
               localField: "porcionId",   // name of users table field
               foreignField: "nombreId", // name of userinfo table field
               as: "ingrediente_kdx"         // alias for userinfo table
           }
       },
    
     // Second Stage
     
    ])
    if(Object.entries(ingredientekardexs).length !== 0){
      console.log('Porciones ingredientekardexs',ingredientekardexs);
      res.send({
        ingredientekardexs       
      })
    }else{

      console.log('Datos de Ingrediente Kardex invalidos. newIngredienteDet',ingredientekardexs);
      res.status(404).send({ message: 'Ingrediente, porcion No EXISTE en KARDEX.'});
    }
  }

});


/*  Esta funcion trae el lote de los registros de todos los productos que vienen en el arreglo productos
    del join entre Unidades Detalles y Kardex
*/

router.post("/kardexlote", isAuth, async (req, res) => {
  console.log('unidadesDetRoute get kardexlote', req.body )
  const {productos}= req.body
  console.log('productos',productos);
  var unidadeskardexs = await Unidadesdet.aggregate([
    // First Stage
     {
     $match : { $or: productos }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "kardexes",       // other table name
             localField: "unidadesId",   // name of users table field
             foreignField: "nombreId", // name of userinfo table field
             as: "unidades_kdx"         // alias for userinfo table
         }
     },
  
    // Second Stage
    {
      $lookup:{
        from: "unidades",       // other table name
        localField: "unidadesId",   // name of users table field
        foreignField: "unidadesId", // name of userinfo table field
        as: "unidades"         // alias for userinfo table
      }
    },
    // Third Stage
   
  ])

  console.log('unidadeskardexs',unidadeskardexs);
  console.log('unidadeskardexs.length',unidadeskardexs.length);
  console.log('unidadeskardexs object.length',Object.entries(unidadeskardexs).length);
  if(Object.entries(unidadeskardexs).length !== 0){
      console.log('unidadeskardexs',unidadeskardexs);
      res.send({
        unidadeskardexs       
      })
  }else{
      console.log('Datos de Unidades Kardex invalidos. newIngredienteDet',unidadeskardexs);
      res.status(404).send({ message: 'Unidades, No EXISTE en KARDEX.'});
  }

});


router.post('/registrar', async (req, res) => {
  console.log('IngredienteDet registrar req.body ',req.body);
  const {unidadesId,familia,productoId,isAutoUnidades,area,unidadesNombre,unidadesCantidad,unidadesUnidad,unidadesFormula,ingredienteNombre,ingredienteCantidad,ingredienteUnidad,ingredienteFormula } = req.body
  console.log('unidadesId',unidadesId);
  console.log('productoId',productoId);
  
  const oldIngredienteDet = await Unidadesdet.findOne({unidadesId:unidadesId,productoId:productoId})
  if(oldIngredienteDet){
    console.log('Error: Porcion Detalle ya existe oldIngredienteDet',oldIngredienteDet);
    res.status(400).send({ message: 'Error: Porcion Detalle ya existe.' });
  }else{
    //console.log('oldIngredienteDet',oldIngredienteDet);
    const ingredienteDet = new Unidadesdet({
        unidadesId:unidadesId,
      productoId:productoId,
      area:area,
      familia:familia,
      unidadesNombre:unidadesNombre,
      unidadesCantidad:unidadesCantidad,
      unidadesUnidad:unidadesUnidad,
      unidadesFormula:unidadesFormula,
      ingredienteNombre:ingredienteNombre,
      ingredienteCantidad:ingredienteCantidad,
      ingredienteUnidad:ingredienteUnidad,
      ingredienteFormula:ingredienteFormula,
      isAutoUnidades:isAutoUnidades,
    });
    const newIngredienteDet = await ingredienteDet.save();
    if (newIngredienteDet) {
      console.log('newIngredienteDet',newIngredienteDet);
      res.send({
        newIngredienteDet       
      })
    } else {
      console.log('Datos de Ingrediente Detalle invalidos. newIngredienteDet',newIngredienteDet);
      res.status(404).send({ message: 'Datos de Ingrediente Detalle invalidos.' });
    }
  }
});

module.exports = router;