const express = require('express');
const Pedformdet = require('../models/pedformDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const pedformdetalles = await Pedformdet.find({}).sort({ "nombre": -1 }).limit(25);
  if(pedformdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedformdetalles);
    console.log('porciones',pedformdetalles)
  }else{
    res.status(404).send({ message: 'Formulario Pedido detalles no encontrados' });
    console.log('Formulario Pedido detalles no encontrados',pedformdetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('pedformDetRoute get ingredientes', req.body )
  const {pedformId}= req.body
  const pedformdetalles = await Pedformdet.find({pedformId:pedformId}).sort({ "nombre": -1 }).limit(25);
  if(pedformdetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedformdetalles);
    console.log('pedformdetalles',pedformdetalles)
  }else{
    res.status(404).send({ message: 'pedformdetalles no encontrados' });
    console.log('pedformdetalles no encontrados',pedformdetalles)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  const {pedformId,itemId,tipoItem,nombre,familia } = req.body
  console.log('pedformId',pedformId);
  console.log('itemId',itemId);
  
  const oldPedformDet = await Pedformdet.findOne({pedformId:pedformId,itemId:itemId})
  if(oldPedformDet){
    console.log('Error: Formulario Pedido Detalle ya existe oldPedformDet',oldPedformDet);
    res.status(400).send({ message: 'Error: Formulario Pedido Detalle ya existe.' });
  }else{
    console.log('oldPedformDet',oldPedformDet);
    const pedformDet = new Pedformdet({
        pedformId:pedformId,
        itemId:itemId,
        tipoItem:tipoItem,
        nombre:nombre,
        familia:familia,
    });
    const newPedformDet = await pedformDet.save();
    if (newPedformDet) {
      console.log('newPedformDet',newPedformDet);
      res.send({
        _id:newPedformDet._id,       
        pedformId:newPedformDet.pedformId,       
        itemId:newPedformDet.itemId,       
        tipoItem:newPedformDet.tipoItem,       
        nombre:newPedformDet.nombre,      
        familia:newPedformDet.familia,      
      })
    } else {
      console.log('Datos de Formulario Pedido Detalle invalidos. newPedformDet',newPedformDet);
      res.status(401).send({ message: 'Datos de Formulario Pedido Detalle invalidos.' });
    }
  }
});

module.exports = router;