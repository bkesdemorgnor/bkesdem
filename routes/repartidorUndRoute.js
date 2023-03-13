const express = require('express');
const Repartidorund = require('../models/repartidorUndModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
//const {addUndcionKardex} = require('../components/addUndcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get RepartidorUnidades req.body:', req.body )
  const repartidorunds = await Repartidorund.find({}).sort({ "nombre": -1 }).limit(100);
  if(repartidorunds){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorunds);
    console.log('get RepartidorUnidades ',repartidorunds)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidor no encontrados' });
    console.log('Formulario de Repartidores no encontrados',repartidorunds)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get Repartidorund Id', req.params )
  const {id} = req.params;
  const Repartidorund = await Repartidorund.find({}).sort({ "nombre": -1 }).limit(100);
  if(Repartidorund){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(Repartidorund);
    console.log('unidades',Repartidorund)
  }else{
    res.status(404).send({ message: 'Formulario de pedidos no encontrados' });
    console.log('Formulario de Repartidores no encontrados',Repartidorund)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {repartidorund} = req.body
  const repartidorunds = await Repartidorund.find({ 'nombre': { $regex: repartidorund, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(repartidorunds){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorunds);
    //console.log('repartidorunds',repartidorunds)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidores no encontrados' });
    console.log('Formularios de Repartidores no encontrados',    res.send(repartidorunds));
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {grupo} = req.body
  const repartidorunds = await Repartidorund.find({ 'grupo': grupo }).sort({ "nombre": 1 }).limit(100);
  if(repartidorunds){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(repartidorunds);
    //console.log('repartidorunds',repartidorunds)
  }else{
    res.status(404).send({ message: 'Formularios de Repartidores no encontrados' });
    console.log('Formularios de Repartidores no encontrados',    res.send(repartidorunds));
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, descripcion, grupo,isEnvioGrupal } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('registrar nombre , descripcion, grupo',nombre, descripcion, grupo,isEnvioGrupal);
  const oldRepartidorUnd = await Repartidorund.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldRepartidorUnd){
    res.status(400).send({ message: 'Error: Formulario de Repartidor ya existe.' });
  }else{
    const repartidorUndId = await getSecuencia("RepartidorUnd");
    console.log('repartidorUndId',repartidorUndId);
    const repartidorund = new Repartidorund({
        repartidorUndId:repartidorUndId,
        nombre: nombre,
        descripcion:descripcion,
        grupo:grupo,
        isEnvioGrupal:isEnvioGrupal,
    });
    const newRepartidorUnd = await repartidorund.save();
    if (newRepartidorUnd) {
      
      console.log('newRepartidorUnd',newRepartidorUnd);
      res.send({
        _id: newRepartidorUnd._id,
        repartidorUndId: newRepartidorUnd.repartidorUndId,
        nombre: newRepartidorUnd.nombre,
        descripcion: newRepartidorUnd.descripcion,
        grupo: newRepartidorUnd.grupo,
        isEnvioGrupal: newRepartidorUnd.isEnvioGrupal,
      })
    } else {
      res.status(401).send({ message: 'Datos de Formulario de Repartidor invalidos.' });
    }
  }
});

module.exports = router;