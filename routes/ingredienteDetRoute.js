const express = require('express');
const Ingredientedet = require('../models/ingredienteDetModel');
const Porciondet = require('../models/porcionDetModel');

const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const ingredientedetalles = await Ingredientedet.find({}).sort({ "nombre": -1 }).limit(25);
  if(ingredientedetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingredientedetalles);
    console.log('ingredientedetalles',ingredientedetalles)
  }else{
    res.status(404).send({ message: 'Ingredientedetalles no encontrados' });
    console.log('Ingredientedetalles no encontrados',ingredientedetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get ingredientes', req.body )
  const {ingredienteId}= req.body
  const ingredientedetalles = await Ingredientedet.find({ingredienteId:ingredienteId}).sort({ "nombre": -1 }).limit(25);
  if(ingredientedetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingredientedetalles);
    console.log('ingredientedetalles',ingredientedetalles)
  }else{
    res.status(404).send({ message: 'Ingredientedetalles no encontrados' });
    console.log('Ingredientedetalles no encontrados',ingredientedetalles)
  }
});


/*  Esta funcion trae de primera intencion los registros del join entre Ingredientes Detalles y Kardex
    En caso que no encuentre trae los registros del join entre Porcion Detalles y Kardex
*/

router.post("/kardexs", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get kardexs', req.body )
  const {productoId}= req.body
  console.log('productoId',productoId);
  var ingredientekardexs = await Ingredientedet.aggregate([
    // First Stage
     {
     $match : { "productoId": productoId }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "kardexes",       // other table name
             localField: "ingredienteId",   // name of users table field
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
    del join entre Ingredientes Detalles y Kardex, en caso que no encuentre del join de Porciones detalles y kardex
*/

router.post("/kardexlote", isAuth, async (req, res) => {
  console.log('ingredienteDetRoute get kardexlote', req.body )
  const {unidades}= req.body
  console.log('unidades',unidades);
  var ingredientekardexs = await Ingredientedet.aggregate([
    // First Stage
     {
     $match : { $or: unidades }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "kardexes",       // other table name
             localField: "ingredienteId",   // name of users table field
             foreignField: "nombreId", // name of userinfo table field
             as: "ingrediente_kdx"         // alias for userinfo table
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
    {
      $lookup:{
          from: "kardexes",       // other table name
          localField: "unidadesId",   // name of users table field
          foreignField: "nombreId", // name of userinfo table field
          as: "unidades_kdx"         // alias for userinfo table
      }
    },
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
      
      console.log('Datos de Ingrediente Kardex invalidos. newIngredienteDet',ingredientekardexs);
      var porcionkardexs = await Porciondet.aggregate([
        // First Stage
        {
        $match : { $or: unidades }
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
            from: "unidades",       // other table name
            localField: "unidadesId",   // name of users table field
            foreignField: "unidadesId", // name of userinfo table field
            as: "unidades"         // alias for userinfo table
          }
        },
        // Third Stage
        {
          $lookup:{
              from: "kardexes",       // other table name
              localField: "unidadesId",   // name of users table field
              foreignField: "nombreId", // name of userinfo table field
              as: "unidades_kdx"         // alias for userinfo table
          }
        },
      
      ])
      console.log('porcionkardexs',porcionkardexs);
      console.log('porcionkardexs.length',porcionkardexs.length);
      console.log('porcionkardexs object.length',Object.entries(porcionkardexs).length);
      if(Object.entries(porcionkardexs).length !== 0){
        console.log('porcionkardexs',porcionkardexs);
        res.send({
          porcionkardexs       
        })
      }else{
        console.log('Datos de Porcion Kardex invalidos. porcionkardexs',porcionkardexs);
        res.status(404).send({ message: 'Ingrediente, porcion No EXISTE en KARDEX.'});
      }
  
  }

});


router.post('/registrar', async (req, res) => {
  console.log('IngredienteDet registrar req.body ',req.body);
  const {ingredienteId,familia,productoId,area,unidadesNombre,unidadesCantidad,unidadesUnidad,unidadesFormula,ingredienteNombre,ingredienteCantidad,ingredienteUnidad,ingredienteFormula } = req.body
  console.log('ingredienteId',ingredienteId);
  console.log('productoId',productoId);
  
  const oldIngredienteDet = await Ingredientedet.findOne({ingredienteId:ingredienteId,productoId:productoId})
  if(oldIngredienteDet){
    console.log('Error: Porcion Detalle ya existe oldIngredienteDet',oldIngredienteDet);
    res.status(400).send({ message: 'Error: Porcion Detalle ya existe.' });
  }else{
    //console.log('oldIngredienteDet',oldIngredienteDet);
    const ingredienteDet = new Ingredientedet({
        ingredienteId:ingredienteId,
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