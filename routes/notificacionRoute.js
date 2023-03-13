const express = require('express');
const Notificacion = require('../models/notificacionModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const notificaciones = await Notificacion.find({}).sort({ "createdAt": -1 }).limit(100);
  if(notificaciones){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(notificaciones);
    //console.log('recetas',notificaciones)
  }else{
    res.status(404).send({ message: 'Recetas no encontradas' });
    console.log('Recetas no encontradas',notificaciones)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get notificaciones Id', req.params )
  const {id} = req.params;
  const notificacion = await Notificacion.find({_id:id}).sort({ "createdAt": -1 }).limit(100);
  if(notificacion){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(notificacion);
    console.log('notificacion',notificacion)
  }else{
    res.status(404).send({ message: 'Notificacion no encontrada' });
    console.log('Notificacion no encontrada',notificacion)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {notificacion} = req.body
  const notificaciones = await Notificacion.find({ 'nombre': { $regex: notificacion, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(notificaciones){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(notificaciones);
    //console.log('notificaciones',notificaciones)
  }else{
    res.status(404).send({ message: 'notificaciones no encontrados' });
    console.log('notificaciones no encontradas', notificaciones );
    
  }
});

/* Obtener todas las notificaciones del destino solicitado que se encuentren activas */
router.post("/destino", isAuth, async (req, res) => {
  console.log('get notificaciones estado', req.body )
  const {destino} = req.body
  const notificaciones = await Notificacion.find({ 'isActivo': true, destino: {$in: [destino,"all"]}}).sort({ "createdAt": -1 }).limit(200);
  if(notificaciones){
    console.log('notificaciones',notificaciones)
    res.send(notificaciones); 
  }else{
    res.status(404).send({ message: 'notificaciones no encontrados' });
    console.log('notificaciones no encontradas', notificaciones );
  }
});


router.post('/registrar', async (req, res) => {
  const {origen, destino,fecha,mensaje,procesoId,tipo,isActivo} = req.body;
  console.log('registrar notificacion :',req.body);
  
    const notificacionId = await getSecuencia("Notificacion");
    console.log('notificacionId',notificacionId);
    const notificacion = new Notificacion({
        notificacionId:notificacionId,
        origen: origen,
        destino: destino,
        fecha: fecha,
        mensaje: mensaje,
        procesoId: procesoId,
        tipo: tipo,
        isActivo: isActivo,
    });
    const newNotificacion = await notificacion.save();
    console.log('newNotificacion',newNotificacion);
    res.send({
      _id:newNotificacion._id,
      notificacionId:newNotificacion.notificacionId,
      origen:newNotificacion.origen,
      destino:newNotificacion.destino,
      fecha:newNotificacion.fecha,
      mensaje:newNotificacion.mensaje,
      procesoId:newNotificacion.procesoId,
      tipo:newNotificacion.tipo,
      isActivo:newNotificacion.isActivo,
    })
 
});

router.put('/actualizar', async (req, res) => {
  var {notificacionId,isActivo} = req.body;
  console.log('actualizar notificacion :',req.body);
  const oldNotificacion = await Notificacion.findOne({notificacionId:notificacionId})
  if(oldNotificacion){
    console.log('notificacionId',oldNotificacion.notificacionId);
    
    oldNotificacion.isActivo = isActivo || oldNotificacion.isActivo;
   
    const updatedNotificacion = await oldNotificacion.save();
    console.log('updatedNotificacion',updatedNotificacion);
    res.send({
      _id:updatedNotificacion._id,
      notificacionId:updatedNotificacion.notificacionId,
      origen:updatedNotificacion.origen,
      destino:updatedNotificacion.destino,
      fecha:updatedNotificacion.fecha,
      mensaje:updatedNotificacion.mensaje,
      procesoId:updatedNotificacion.procesoId,
      tipo:updatedNotificacion.tipo,
      isActivo:updatedNotificacion.isActivo,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Notificacion NO existe.' });
    console.log('Error de Actualizacion: Notificacion NO existe.',oldNotificacion);
  }
});

module.exports = router;