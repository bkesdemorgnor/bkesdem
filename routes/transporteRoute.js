const express = require('express');
const Transporte = require('../models/transporteModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get transportes' )
  const transportes = await Transporte.find({}).sort({ "nombre": -1 }).limit(100);
  if(transportes.length>0){
    
    res.send(transportes);
    console.log('transportes',transportes)
  }else{
    res.status(404).send({ message: 'Transportes no encontrados' });
    console.log('Transportes no encontradas',transportes)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get transportes Id', req.params )
  const {id} = req.params;
  const transporte = await Transporte.find({}).sort({ "nombre": -1 }).limit(100);
  if(transporte.length>0){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transporte);
    console.log('transporte',transporte)
  }else{
    res.status(404).send({ message: 'Transporte no encontrada' });
    console.log('Transporte no encontrada',transporte)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {transporte} = req.body
  const transportes = await Transporte.find({ 'nombre': { $regex: transporte, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(transportes.length>0){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transportes);
    //console.log('transportes',transportes)
  }else{
    res.status(404).send({ message: 'transportes no encontrados' });
    console.log('transportes no encontradas', transportes );
    
  }
});


router.post("/estado", isAuth, async (req, res) => {
  console.log('get transportes estado', req.body )
  const {estado} = req.body
  const transportes = await Transporte.find({ 'estado': estado}).sort({ "nombre": -1 }).limit(200);
  if(transportes.length>0){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transportes);
    console.log('transportes',transportes)
  }else{
    res.status(404).send({ message: 'transportes no encontrados' });
    console.log('transportes no encontradas', transportes );
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, apellido,email,isActivo} = req.body;
  console.log('registrar transporte :',req.body);
  const oldTransporte = await Transporte.findOne({email:email})
  if(oldTransporte){
    res.status(400).send({ message: 'Error: Transporte ya existe.' });
  }else{
    const transporteId = await getSecuencia("Transporte");
    console.log('transporteId',transporteId);
    const transporte = new Transporte({
        transporteId:transporteId,
        nombre: nombre,
        apellido: apellido,
        email: email,
        isActivo: isActivo,
    });
    const newTransporte = await transporte.save();
    console.log('newTransporte',newTransporte);
    res.send({
      _id:newTransporte._id,
      transporteId:newTransporte.transporteId,
      nombre:newTransporte.nombre,
      apellido:newTransporte.apellido,
      email:newTransporte.email,
      isActivo:newTransporte.isActivo,
    })
    
  }
});

router.put('/actualizar', async (req, res) => {
  var {transporteId,nombre, categoria,precio,recetaId,recetaNombre,isSys,isActivo,estado} = req.body;
  console.log('actualizar transporte :',req.body);
  const oldTransporte = await Transporte.findOne({transporteId:transporteId})
  if(oldTransporte){
    console.log('transporteId',oldTransporte.transporteId);
    
    oldTransporte.nombre = nombre || oldTransporte.nombre;
    oldTransporte.apellido = apellido || oldTransporte.apellido;
    oldTransporte.email = email || oldTransporte.email;
    oldTransporte.isActivo = isActivo || oldTransporte.isActivo;

    const updatedTransporte = await oldTransporte.save();
    console.log('updatedTransporte',updatedTransporte);
    res.send({
      _id:updatedTransporte._id,
      transporteId:updatedTransporte.transporteId,
      nombre:updatedTransporte.nombre,
      apellido:updatedTransporte.apellido,
      email:updatedTransporte.email,
      isActivo:updatedTransporte.isActivo,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Transporte NO existe.' });
    console.log('Error de Actualizacion: Transporte NO existe.',oldTransporte.transporteId);
  }
});

module.exports = router;