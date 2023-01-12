const express = require('express');
const Chofer = require('../models/choferModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get choferes' )
  const chofers = await Chofer.find({}).sort({ "nombre": -1 }).limit(100);
  if(chofers.length>0){
    
    res.send(chofers);
    console.log('chofers',chofers)
  }else{
    res.status(404).send({ message: 'Choferes no encontrados' });
    console.log('Choferes no encontradas',chofers)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get chofers Id', req.params )
  const {id} = req.params;
  const chofer = await Chofer.find({}).sort({ "nombre": -1 }).limit(100);
  if(chofer){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(chofer);
    console.log('chofer',chofer)
  }else{
    res.status(404).send({ message: 'Chofer no encontrada' });
    console.log('Chofer no encontrada',chofer)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {chofer} = req.body
  const chofers = await Chofer.find({ 'nombre': { $regex: chofer, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(chofers){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(chofers);
    //console.log('chofers',chofers)
  }else{
    res.status(404).send({ message: 'chofers no encontrados' });
    console.log('chofers no encontradas', chofers );
    
  }
});


router.post("/estado", isAuth, async (req, res) => {
  console.log('get chofers estado', req.body )
  const {estado} = req.body
  const chofers = await Chofer.find({ 'estado': estado}).sort({ "nombre": -1 }).limit(200);
  if(chofers){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(chofers);
    //console.log('chofers',chofers)
  }else{
    res.status(404).send({ message: 'chofers no encontrados' });
    console.log('chofers no encontradas', chofers );
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, apellido,email,isActivo} = req.body;
  console.log('registrar chofer :',req.body);
  const oldChofer = await Chofer.findOne({email:email})
  if(oldChofer){
    res.status(400).send({ message: 'Error: Chofer ya existe.' });
  }else{
    const choferId = await getSecuencia("Chofer");
    console.log('choferId',choferId);
    const chofer = new Chofer({
        choferId:choferId,
        nombre: nombre,
        apellido: apellido,
        email: email,
        isActivo: isActivo,
    });
    const newChofer = await chofer.save();
    console.log('newChofer',newChofer);
    res.send({
      _id:newChofer._id,
      choferId:newChofer.choferId,
      nombre:newChofer.nombre,
      apellido:newChofer.apellido,
      email:newChofer.email,
      isActivo:newChofer.isActivo,
    })
    
  }
});

router.put('/actualizar', async (req, res) => {
  var {choferId,nombre, categoria,precio,recetaId,recetaNombre,isSys,isActivo,estado} = req.body;
  console.log('actualizar chofer :',req.body);
  const oldChofer = await Chofer.findOne({choferId:choferId})
  if(oldChofer){
    console.log('choferId',oldChofer.choferId);
    
    oldChofer.nombre = nombre || oldChofer.nombre;
    oldChofer.apellido = apellido || oldChofer.apellido;
    oldChofer.email = email || oldChofer.email;
    oldChofer.isActivo = isActivo || oldChofer.isActivo;

    const updatedChofer = await oldChofer.save();
    console.log('updatedChofer',updatedChofer);
    res.send({
      _id:updatedChofer._id,
      choferId:updatedChofer.choferId,
      nombre:updatedChofer.nombre,
      apellido:updatedChofer.apellido,
      email:updatedChofer.email,
      isActivo:updatedChofer.isActivo,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Chofer NO existe.' });
    console.log('Error de Actualizacion: Chofer NO existe.',oldChofer.choferId);
  }
});

module.exports = router;