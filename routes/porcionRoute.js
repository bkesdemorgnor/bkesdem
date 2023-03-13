const express = require('express');
const Porcion = require('../models/porcionModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const porciones = await Porcion.find({}).sort({ "nombre": -1 }).limit(100);
  if(porciones){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciones);
    console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'Porciones no encontrados' });
    console.log('Porciones no encontrados',porciones)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get porcion Id', req.params )
  const {id} = req.params;
  const porcion = await Porcion.find({}).sort({ "nombre": -1 }).limit(100);
  if(porciones){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciones);
    console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'Porciones no encontrados' });
    console.log('Porciones no encontrados',porciones)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {porcion} = req.body
  const porciones = await Porcion.find({ 'nombre': { $regex: porcion, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(porciones){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(porciones);
    console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'Porciones no encontrados' });
    console.log('Porciones no encontrados',    res.send(porciones));
    
  }
});

router.post("/grupo", isAuth, async (req, res) => {
  console.log('get porcions grupo', req.body )
  const {grupo} = req.body
  const porciones = await Porcion.find({ 'grupo': grupo }).sort({ "nombre": -1 }).limit(100);
  if(porciones){
    res.send(porciones);
    console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'Porciones no encontrados' });
    console.log('Porciones no encontrados',    res.send(porciones));
  }
});

router.post("/familia", isAuth, async (req, res) => {
  console.log('get porcions familia', req.body )
  const {familia} = req.body
  const porciones = await Porcion.find({ 'familia': {$in:familia}}).sort({ "nombre": -1 }).limit(100);
  if(porciones.length>0){
    
    res.send(porciones);
    //console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'porciones no encontrados' });
    console.log('porciones no encontrados',porciones)
  }
});

router.post("/familias", isAuth, async (req, res) => {
  console.log('get porcions familias', req.body )
  const {familias} = req.body
  const porciones = await Porcion.find({ 'familias': {$in:familias}}).sort({ "nombre": -1 }).limit(100);
  if(porciones.length>0){
    
    res.send(porciones);
    //console.log('porciones',porciones)
  }else{
    res.status(404).send({ message: 'porciones no encontrados' });
    console.log('porciones no encontrados',porciones)
  }
});


router.post("/addfamilia", isAuth, async (req, res) => {
  console.log('Add familia a porcion', req.body )
  const {porcionId,familia} = req.body;
  if(porcionId && familia){
    console.log('Llego familia',familia);
    const oldPorcion = await Porcion.findOne({porcionId:porcionId,familias:{$nin:[familia]}},{nombre:1,familias:1})
    console.log('oldPorcion',oldPorcion);
    if(oldPorcion){
      console.log('Porcion Existe',oldPorcion);
      oldPorcion.familias= [...oldPorcion.familias,familia]
      const newPorcion = await oldPorcion.save();
      if (newPorcion) {
        console.log('newPorcion',newPorcion);
        res.send({
          _id: newPorcion._id,
          nombre: newPorcion.nombre,
          unidad: newPorcion.unidad,
          descripcion: newPorcion.descripcion,
          areas: newPorcion.areas,
          sucursalTipo: newPorcion.sucursalTipo,
          rendimiento: newPorcion.rendimiento,
          isAutoProcess: newPorcion.isAutoProcess,
          isEnvioPorcion: newPorcion.isEnvioPorcion,
          grupo:newPorcion.grupo,
          familias:newPorcion.familias,
          precio:newPorcion.precio,
        })
      }else {
        res.status(404).send({ message: 'Datos de Porcion invalidos.' });
      }

    }else{
      res.status(400).send({ message: 'Error: Porcion NO existe o Familia ya inscrito.' });
    }
  }else{
    console.log('No Llego familia',familia);
    res.status(404).send({ message: 'Faltan Datos de Proveedor.' });
  }
  
});


/*  Esta funcion trae el lote de los registros de todos las porciones que vienen en el arreglo porciones
    del join entre Porcion y Kardex
*/

router.post("/kardexlote", isAuth, async (req, res) => {
  console.log('porcionRoute get kardexlote', req.body )
  const {porciones}= req.body
  console.log('porciones',porciones);
  var porcionkardexs = await Porcion.aggregate([
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

/* Consulta de lote de Porciones join con porcionesdetalle
Parametros de entrada:
  porciones : [porcionId:porcionId1,porcionId:porcionId2 ......
*/
router.post("/porcionesdetlote", isAuth, async (req, res) => {
  console.log('get porciones porcionesdetlote', req.body )
  const {porciones}= req.body
  console.log('porciones',porciones);
  var v_porciones = await Porcion.aggregate([
          // First Stage
          {
            $match : { $or: porciones }
          },
          // Join with user_info table
          {
            $lookup:{
              from: "porciondets",       // other table name
              localField: "unidadesId",   // name of users table field
              foreignField: "unidadesId", // name of userinfo table field
              as: "ingredientes_det"         // alias for userinfo table
            }
          },
          // Second Stage
        ])
          
        console.log('ingredientes object.length',Object.entries(ingredientes).length);
        if(Object.entries(ingredientes).length !== 0){
          console.log('ingredientes',ingredientes);
          res.send({
            ingredientes       
          })
        }else{
          console.log('Datos de Ingredientes invalidos. ',ingredientes);
          res.status(404).send({ message: 'Ingredientes, detalle No EXISTE'});
        }
    });
        
    

router.post('/registrar', async (req, res) => {
  console.log('porcion registrar req.body',req.body);
  var {nombre,familia, unidad, descripcion, areas, rendimiento,sucursalTipo,isAutoProcess,isEnvioPorcion,isPorcionPermi, grupo,precio } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('porcion registrar :',nombre, unidad, descripcion, areas, rendimiento,isAutoProcess,isEnvioPorcion,grupo);
  const oldPorcion = await Porcion.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldPorcion){
    res.status(400).send({ message: 'Error: Porcion ya existe.' });
  }else{
    const porcionId = await getSecuencia("Porcion");
    console.log('porcionId',porcionId);
    const porcion = new Porcion({
      porcionId:porcionId,
      nombre: nombre,
      isPorcionPermi: isPorcionPermi,
      unidad: unidad,
      descripcion:descripcion,
      areas:areas,
      sucursalTipo:sucursalTipo,
      rendimiento:rendimiento,
      isAutoProcess:isAutoProcess,
      isEnvioPorcion:isEnvioPorcion,
      grupo:grupo,
      familias:[familia],
      precio:precio,
    });
    const newPorcion = await porcion.save();
    if (newPorcion) {
      
      console.log('newPorcion',newPorcion);
      await addPorcionKardex(porcionId,req.body);

      res.send({
        _id: newPorcion._id,
        porcionId: newPorcion.porcionId,
        nombre: newPorcion.nombre,
        isPorcionPermi: newPorcion.isPorcionPermi,
        unidad: newPorcion.unidad,
        descripcion: newPorcion.descripcion,
        areas: newPorcion.areas,
        sucursalTipo: newPorcion.sucursalTipo,
        rendimiento: newPorcion.rendimiento,
        isAutoProcess: newPorcion.isAutoProcess,
        isEnvioPorcion: newPorcion.isEnvioPorcion,
        grupo: newPorcion.grupo,
        familias: newPorcion.familias,
        precio: newPorcion.precio,
      })
    } else {
      res.status(401).send({ message: 'Datos de Porcion invalidos.' });
    }
  }
});

module.exports = router;