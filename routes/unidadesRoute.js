const express = require('express');
const Unidades = require('../models/unidadesModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { getToken, isAuth } = require( '../util');
const {addAllSucKardex} = require('../components/addAllSucKardex');
//const Unidadesdet = require('../models/unidadesDetModel');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const unidades = await Unidades.find({}).sort({ "nombre": -1 }).limit(100);
  if(unidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',unidades)
  }
});

router.post("/buscar", isAuth, async (req, res) => {
  console.log('Unidades buscar', req.body )
  const {nombre} = req.body
  const unidades = await Unidades.find({ 'nombre': { $regex: nombre, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(unidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',unidades)
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  //console.log('get unidades grupo', req.body )
  const {grupo} = req.body
  const unidades = await Unidades.find({ 'grupo': grupo}).sort({ "nombre": -1 }).limit(100);
  if(unidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',unidades)
  }
});


router.post("/autounidades", isAuth, async (req, res) => {
  console.log('get autounidades', req.body )
  const {isAutoUnidades} = req.body
  const unidades = await Unidades.find({ 'isAutoUnidades': isAutoUnidades}).sort({ "nombre": -1 }).limit(100);
  if(unidades){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Unidades no encontrados' });
    console.log('Unidades no encontrados',unidades)
  }
});


router.post("/familia", isAuth, async (req, res) => {
  console.log('get unidades familia', req.body )
  const {familia} = req.body
  const unidades = await Unidades.find({ 'familia': familia}).sort({ "nombre": -1 }).limit(100);
  if(unidades.length>0){
    
    res.send(unidades);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Unidades no encontrados' });
    console.log('Unidades no encontrados',unidades)
  }
});

/* Consulta de lote de Unidades join con unidadesdetalle
Parametros de entrada:
  productos : [productoId:productoId1,productoId:productoId2 ......
 */
router.post("/unidadesdetlote", isAuth, async (req, res) => {
  console.log('get unidades unidadesdetlote', req.body )
  const {productos}= req.body
  console.log('productos',productos);
  var unidades = await Unidades.aggregate([
    // First Stage
     {
     $match : { $or: productos }
     },
   
    // Join with user_info table
     {
         $lookup:{
             from: "unidadesdets",       // other table name
             localField: "productoId",   // name of users table field
             foreignField: "productoId", // name of userinfo table field
             as: "unidades_det"         // alias for userinfo table
         }
     },
  
   // Second Stage
   
  ])
  
  console.log('unidades object.length',Object.entries(unidades).length);
  if(Object.entries(unidades).length !== 0){
      console.log('v_unidades',unidades);
      res.send({
        unidades       
      })
  }else{
      console.log('Datos de Unidades invalidos. ',unidades);
      res.status(404).send({ message: 'Unidades, detalle No EXISTE'});
  }

});

router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  var {nombre,familia,unidad,descripcion,tipo,areas,isMerma,isAutoProcess,isAutoUnidades,isBien,mermaDesconge,mermaCoccion,mermaLimpieza, grupo} = req.body
  //nombre = nombre.toUpperCase()
  if(nombre && familia && unidad && descripcion && tipo && grupo){
    const oldProducto = await Unidades.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
    if(oldProducto){
      res.status(400).send({ message: 'Error: Unidades ya existente.' });
    }else{
      const productoId = await getSecuencia("Unidades");
      console.log('productoId',productoId);
      const producto = new Unidades({
        productoId:productoId,
        nombre: nombre,
        familia: familia,
        unidad: unidad,
        descripcion: descripcion,
        tipo: tipo,
        areas: areas,
        isMerma: isMerma,
        isAutoProcess: isAutoProcess,
        isAutoUnidades: isAutoUnidades,
        isAutoIngre: isAutoIngre,
        isPorcionConv: isPorcionConv,
        isBien: isBien,
        mermaDesconge: mermaDesconge,
        mermaCoccion: mermaCoccion,
        mermaLimpieza: mermaLimpieza,
        grupo: grupo,
      });
      const newProducto = await producto.save();
      if (newProducto) {
        console.log('newProducto',newProducto);
        await addAllSucKardex(productoId,req.body);
        res.send({
          _id: newProducto._id,
          productoId: newProducto.productoId,
          nombre: newProducto.nombre,
          familia: newProducto.familia,
          unidad: newProducto.unidad,
          descripcion: newProducto.descripcion,
          areas: newProducto.areas,
          tipo: newProducto.tipo,
          isMerma: newProducto.isMerma,
          isAutoProcess: newProducto.isAutoProcess,
          isAutoUnidades: newProducto.isAutoUnidades,
          isAutoIngre: newProducto.isAutoIngre,
          isPorcionConv: newProducto.isPorcionConv,
          isBien: newProducto.isBien,
          mermaDesconge: newProducto.mermaDesconge,
          mermaCoccion: newProducto.mermaCoccion,
          mermaLimpieza: newProducto.mermaLimpieza,
          grupo: newProducto.grupo
        })
      } else {
        res.status(400).send({ message: 'Datos de Unidades invalidos.' });
        console.log('Datos de Unidades invalidos.',);  
      }
    }
  }else{
    console.log('Falta parametro(s) de Unidades.',);
    res.status(400).send({ message: 'Falta parametro(s) de Unidades.' });
  }
});

module.exports = router;