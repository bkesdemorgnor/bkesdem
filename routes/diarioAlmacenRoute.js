const express = require('express');
const Diarioalmacen = require('../models/diarioalmacenModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { getToken, isAuth } = require( '../util');
const {inDiarioAlmKardex} = require('../components/inDiarioAlmKardex');
//const Unidadesdet = require('../models/unidadesDetModel');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const diarios = await Diarioalmacen.find({}).sort({ "nombre": -1 }).limit(100);
  if(diarios){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(diarios);
    //console.log('unidades',unidades)
  }else{
    res.status(404).send({ message: 'Diarios de Almacen no encontrados' });
    console.log('Diarios de Almacen no encontrados',diarios)
  }
});
/* 
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
  console.log('get unidades grupo', req.body )
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


router.post("/familia", isAuth, async (req, res) => {
  console.log('get unidades familia', req.body )
  const {familia} = req.body
  const unidades = await Unidades.find({ 'familia': familia}).sort({ "nombre": -1 }).limit(100);
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
 */
/* Consulta de lote de Unidades join con unidadesdetalle
Parametros de entrada:
  productos : [productoId:productoId1,productoId:productoId2 ......
 */

    /* 
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
 */

// Api que actualiza el estado de un Diario de Almacen
// Parametros:  _id,  estado

router.put("/updateestado", isAuth, async (req, res) => {
  console.log('Diario Almacen updateestado', req.body )
  const {_id,estado} = req.body
  const diarioAlmacen = await Diarioalmacen.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
  if(diarioAlmacen){
    diarioAlmacen.estado = estado;
    const updatedDiarioAlmacen = await diarioAlmacen.save();
    if(updatedDiarioAlmacen){
      console.log('updateestado ordenes de compra',updatedDiarioAlmacen)
      res.send(updatedDiarioAlmacen);
    }else{
      console.log('Error en updateestado Orden de Compra',   updatedDiarioAlmacen);
      res.status(404).send({ message: 'Error en updateestado Diario Almacen' });
    }

  }else{
    console.log('Diario Almacen no encontrado',   diarioAlmacen);
    res.status(404).send({ message: 'Diario almacen no encontrado' });
  }
});

// Api que busca y envia todos los Diarios de Almacen que tengan el estado solicitado
// Parametros:   estado : Pendiente, Pagado, Anulado

router.get("/:estado", isAuth, async (req, res) => {
  console.log('Diario Almacen estado', req.params )
  const {estado} = req.params
  const diariosAlmacen = await Diarioalmacen.find({ 'estado':estado }).sort({ "updatedAt": -1 }).limit(200);
  if(diariosAlmacen){
      console.log('Diarios de Almacen con el estado solicitado',diariosAlmacen,estado)
      res.send(diariosAlmacen);
  }else{
    console.log('Diario Almacen no encontrado',   diariosAlmacen);
    res.status(404).send({ message: 'Diarios almacen no encontrado' });
  }
});

// Buscar todos los diarioAlmacen del isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) que viene en isEstado 
router.post("/isestado", isAuth, async (req, res) => {
  console.log('get diarios de Almacen que tienen el isEstado solicitado en true', req.body )
  const {isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado"){
    switch(isEstado){
      case "isFormulado":
        console.log('isFormulado');
        var diariosAlmacen = await Diarioalmacen.find({ "isFormulado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isRecibido":
        console.log('isRecibido');
        var diariosAlmacen = await Diarioalmacen.find({ "isRecibido":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPresupuestado":
        console.log('isPresupuestado');
        var diariosAlmacen = await Diarioalmacen.find({ "isPresupuestado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPagado":
        console.log('isPagado');
        var diariosAlmacen = await Diarioalmacen.find({ "isPagado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      default:
        console.log('Error Default Parametro isEstado Inconrrecto');
        //res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
    }
    //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
    //const ordenes = await Ordencompra.find({ isEstado:{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
  
    if(diariosAlmacen){
      console.log('Diarios Almacen con isEstado',isEstado,diariosAlmacen)
      res.send(diariosAlmacen);
    }else{
      console.log('Diarios Almacen no encontrados',   diariosAlmacen);
      res.status(404).send({ message: 'Diarios Almacen no encontrados' });
    }

  }else{
    console.log('Error : Get Diarios Almacen - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get Diarios Almacen - isEstado incorrecto' });
  }
});

// Poner el isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) recibido en isEstado en true
router.put("/isestadoon", isAuth, async (req, res) => {
  console.log('Poner true Diarios Almacen del isEstado req.body', req.body )
  const {_id,isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado"){

    var diarioAlmacen = await Diarioalmacen.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
    if(diarioAlmacen){
      switch(isEstado){
        case "isFormulado":
          console.log('isFormulado');
          diarioAlmacen.isFormulado = true;
          break;
        case "isRecibido":
          console.log('isRecibido');
          diarioAlmacen.isRecibido = true;
          break;
        case "isPresupuestado":
          console.log('isPresupuestado');
          diarioAlmacen.isPresupuestado = true;
          break;
        case "isPagado":
          console.log('isPagado');
          diarioAlmacen.isPagado = true;
          break;
        default:
          console.log('Error Default Parametro isEstado Inconrrecto');
          //res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
      }
      const updatedOrdenCompra = await diarioAlmacen.save();
      if(updatedOrdenCompra){
        console.log('updateestado ordenes de compra',updatedOrdenCompra)
        res.send(updatedOrdenCompra);
      }else{
        console.log('Error en updateestado Orden de Compra',   updatedOrdenCompra);
        res.status(404).send({ message: 'Error en updateestado Diario de Almacen' });
      }
    
    }else{
      console.log('Diario de Almacen no encontrado',   diarioAlmacen);
      res.status(404).send({ message: 'Diario de Almacen no encontrado' });
    }
    //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
    //const ordenes = await Ordencompra.find({ isEstado:{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
  
   

  }else{
    console.log('Error : Get Diario de Almacen - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get Diario de Almacen - isEstado incorrecto' });
  }
});




router.post('/registrar', async (req, res) => {
  console.log('registrar diarioAlmacen req.body ',req.body);
  var {nombre,estado,ordencompraId,nombreOrdenCompra,proveedorId,proveedorNombre,proveedorDireccion,compraId,descripcion,montoAtendido,
    fechaIngreso,horaIngreso,fechaAtendido,docref,grupoDeCompra,sucursal,compraDetalles,isRecibido,usuario} = req.body
  //nombre = nombre.toUpperCase()
  if(nombre && ordencompraId && proveedorId && descripcion && proveedorNombre && montoAtendido){
    const oldDiarioAlmacen = await Diarioalmacen.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
    if(oldDiarioAlmacen){
      console.log('Error: Diario Almacen ya existe.',oldDiarioAlmacen);
      res.status(400).send({ message: 'Error: Diario Almacen ya existe.' });
    }else{
      const diarioAlmacenId = await getSecuencia("DiarioAlmacen");
      console.log('diarioAlmacenId',diarioAlmacenId);
      const diarioalmacen = new Diarioalmacen({
        diarioAlmacenId:diarioAlmacenId,
        ordencompraId:ordencompraId,
        proveedorId: proveedorId,
        proveedorNombre: proveedorNombre,
        proveedorDireccion: proveedorDireccion,
        compraId: compraId,
        nombre: nombre,
        nombreOrdenCompra: nombreOrdenCompra,
        descripcion: descripcion,
        docref: docref,
        isRecibido: isRecibido,
        montoAtendido: montoAtendido,
        fechaIngreso: fechaIngreso,
        horaIngreso: horaIngreso,
        fechaAtendido: fechaAtendido,
        grupoDeCompra: grupoDeCompra,
        usuario: usuario,
        sucursal: sucursal,
        estado: "Pendiente",
        compraDetalles: compraDetalles,
        
      });
      const newDiario = await diarioalmacen.save();
      if (newDiario) {
        console.log('newDiario',newDiario);
        await inDiarioAlmKardex(req.body)
        res.send({
          _id: newDiario._id,
          diarioAlmacenId: newDiario.diarioAlmacenId,
          ordencompraId: newDiario.ordencompraId,
          proveedorId: newDiario.proveedorId,
          proveedorNombre: newDiario.proveedorNombre,
          proveedorDireccion: newDiario.proveedorDireccion,
          compraId: newDiario.compraId,
          nombre: newDiario.nombre,
          nombreOrdenCompra: newDiario.nombreOrdenCompra,
          descripcion: newDiario.descripcion,
          docref: newDiario.docref,
          isRecibido: newDiario.isRecibido,
          isPagado: newDiario.isPagado,
          montoAtendido: newDiario.montoAtendido,
          fechaIngreso: newDiario.fechaIngreso,
          horaIngreso: newDiario.horaIngreso,
          fechaAtendido: newDiario.fechaAtendido,
          grupoDeCompra: newDiario.grupoDeCompra,
          usuario: newDiario.usuario,
          sucursal: newDiario.sucursal,
          estado: newDiario.estado,
          compraDetalles: newDiario.compraDetalles,
          
        })
      } else {
        res.status(400).send({ message: 'Datos de Diario Almacen invalidos.' });
        console.log('Datos de Diario Almacen invalidos.',);  
      }
    }
  }else{
    console.log('Falta parametro(s) de Diario Almacen.',);
    res.status(400).send({ message: 'Falta parametro(s) de Diario Almacen.' });
  }
});

module.exports = router;