const express = require('express');
const Pedform = require('../models/pedformModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
//const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const pedforms = await Pedform.find({}).sort({ "nombre": -1 }).limit(100);
  if(pedforms){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedforms);
    //console.log('porciones',pedforms)
  }else{
    res.status(404).send({ message: 'Formularios de Pedido no encontrados' });
    console.log('Formulario de Pedidos no encontrados',pedforms)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get porcion Id', req.params )
  const {id} = req.params;
  const pedform = await Pedform.find({}).sort({ "nombre": -1 }).limit(100);
  if(pedform){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedform);
    console.log('porciones',pedform)
  }else{
    res.status(404).send({ message: 'Formulario de pedidos no encontrados' });
    console.log('Formulario de Pedidos no encontrados',pedform)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {pedform} = req.body
  const pedforms = await Pedform.find({ 'nombre': { $regex: pedform, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(pedforms){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedforms);
    //console.log('pedforms',pedforms)
  }else{
    res.status(404).send({ message: 'Formularios de Pedidos no encontrados' });
    console.log('Formularios de Pedidos no encontrados',    res.send(pedforms));
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {grupo} = req.body
  const pedforms = await Pedform.find({ 'grupo': grupo }).sort({ "nombre": 1 }).limit(100);
  if(pedforms){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedforms);
    //console.log('pedforms',pedforms)
  }else{
    res.status(404).send({ message: 'Formularios de Pedidos no encontrados' });
    console.log('Formularios de Pedidos no encontrados',    res.send(pedforms));
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, descripcion, grupo } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('registrar nombre unidad, descripcion, area, rendimiento',nombre, descripcion, grupo);
  const oldPedform = await Pedform.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldPedform){
    res.status(400).send({ message: 'Error: Formulario de Pedido ya existe.' });
  }else{
    const pedformId = await getSecuencia("Pedform");
    console.log('pedformId',pedformId);
    const pedform = new Pedform({
      pedformId:pedformId,
      nombre: nombre,
      descripcion:descripcion,
      grupo:grupo,
    });
    const newPedform = await pedform.save();
    if (newPedform) {
      
      console.log('newPedform',newPedform);
      res.send({
        _id: newPedform._id,
        pedformId: newPedform.pedformId,
        nombre: newPedform.nombre,
        descripcion: newPedform.descripcion,
        grupo: newPedform.grupo,
      })
    } else {
      res.status(401).send({ message: 'Datos de Formulario de Pedido invalidos.' });
    }
  }
});

module.exports = router;