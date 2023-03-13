const express = require('express');
const Repartidorpor = require('../models/repartidorPorModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
//const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get RepartidorPorciones req.body:', req.body )
  const repartidorpors = await Repartidorpor.find({}).sort({ "nombre": -1 }).limit(100);
  if(repartidorpors){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorpors);
    console.log('get RepartidorPorciones ',repartidorpors)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidor no encontrados' });
    console.log('Formulario de Repartidores no encontrados',repartidorpors)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get repartidorpor Id', req.params )
  const {id} = req.params;
  const repartidorpor = await Repartidorpor.find({}).sort({ "nombre": -1 }).limit(100);
  if(repartidorpor){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorpor);
    console.log('porciones',repartidorpor)
  }else{
    res.status(404).send({ message: 'Formulario de pedidos no encontrados' });
    console.log('Formulario de Repartidores no encontrados',repartidorpor)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {repartidorpor} = req.body
  const repartidorpors = await Repartidorpor.find({ 'nombre': { $regex: repartidorpor, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(repartidorpors){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorpors);
    //console.log('repartidorpors',repartidorpors)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidores no encontrados' });
    console.log('Formularios de Repartidores no encontrados',    res.send(repartidorpors));
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {grupo} = req.body
  const repartidorpors = await Repartidorpor.find({ 'grupo': grupo }).sort({ "nombre": 1 }).limit(100);
  if(repartidorpors){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorpors);
    //console.log('repartidorpors',repartidorpors)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidores no encontrados' });
    console.log('Formularios de Repartidores no encontrados',    res.send(repartidorpors));
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, descripcion, grupo,isEnvioGrupal } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('registrar nombre , descripcion, grupo',nombre, descripcion, grupo,isEnvioGrupal);
  const oldRepartidorPor = await Repartidorpor.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldRepartidorPor){
    res.status(400).send({ message: 'Error: Formulario de Repartidor ya existe.' });
  }else{
    const repartidorPorId = await getSecuencia("RepartidorPor");
    console.log('repartidorPorId',repartidorPorId);
    const repartidorpor = new Repartidorpor({
        repartidorPorId:repartidorPorId,
        nombre: nombre,
        descripcion:descripcion,
        grupo:grupo,
        isEnvioGrupal:isEnvioGrupal,
    });
    const newRepartidorPor = await repartidorpor.save();
    if (newRepartidorPor) {
      
      console.log('newRepartidorPor',newRepartidorPor);
      res.send({
        _id: newRepartidorPor._id,
        repartidorPorId: newRepartidorPor.repartidorPorId,
        nombre: newRepartidorPor.nombre,
        descripcion: newRepartidorPor.descripcion,
        grupo: newRepartidorPor.grupo,
        isEnvioGrupal: newRepartidorPor.isEnvioGrupal,
      })
    } else {
      res.status(401).send({ message: 'Datos de Formulario de Repartidor invalidos.' });
    }
  }
});

module.exports = router;