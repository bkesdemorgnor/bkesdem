const express = require('express');
const Pedidodet = require('../models/pedidoDetModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const pedidodetalles = await Pedidodet.find({}).sort({ "nombre": -1 }).limit(25);
  if(pedidodetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidodetalles);
    console.log('porciones',pedidodetalles)
  }else{
    res.status(404).send({ message: 'Pedido detalles no encontrados' });
    console.log('Pedido detalles no encontrados',pedidodetalles)
  }
});


router.post("/ingredientes", isAuth, async (req, res) => {
  console.log('pedidoDetRoute get ingredientes', req.body )
  const {pedidoId}= req.body
  console.log('pedidoDetRoute get ingredientes pedidoId:', pedidoId )
  const pedidodetalles = await Pedidodet.find({pedidoId:pedidoId}).sort({ "nombre": -1 }).limit(25);
  if(pedidodetalles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidodetalles);
    //console.log('pedidodetalles',pedidodetalles)
  }else{
    res.status(404).send({ message: 'pedidodetalles no encontrados' });
    console.log('pedidodetalles no encontrados',pedidodetalles)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  const {pedidoId,itemId,tipoItem,nombre,consumo,stock,stockEmergencia,pedidoSys,pedidoSolicitado,pedidoConsolidado,itemAtendido,pesoBruto } = req.body
  console.log('pedidoId',pedidoId);
  console.log('itemId',itemId);
  
  const oldPedidoDet = await Pedidodet.findOne({pedidoId:pedidoId,itemId:itemId})
  if(oldPedidoDet){
    console.log('Error: Pedido Detalle ya existe oldPedidoDet',oldPedidoDet);
    res.status(400).send({ message: 'Error: Pedido Detalle ya existe.' });
  }else{
    console.log('oldPedidoDet',oldPedidoDet);
    const pedidoDet = new Pedidodet({
        pedidoId:pedidoId,
        itemId:itemId,
        tipoItem:tipoItem,
        nombre:nombre,
        consumo:consumo,
        stock:stock,
        stockEmergencia:stockEmergencia,
        pedidoSys:pedidoSys,
        pedidoSolicitado:pedidoSolicitado,
        pedidoConsolidado:pedidoConsolidado,
        itemAtendido:itemAtendido,
        pesoBruto:pesoBruto,
    });
    const newPedidoDet = await pedidoDet.save();
    if (newPedidoDet) {
      console.log('newPedidoDet',newPedidoDet);
      res.send({
        newPedidoDet       
      })
    } else {
      console.log('Datos de Pedido Detalle invalidos. newPedidoDet',newPedidoDet);
      res.status(401).send({ message: 'Datos de Pedido Detalle invalidos.' });
    }
  }
});

router.put('/actualizar', async (req, res) => {
  var {pedidoId,itemId, tipoItem,nombre,consumo,stock,stockEmergencia,pedidoSys,pedidoSolicitado,pedidoConsolidado,itemAtendido,pesoBruto} = req.body;
  console.log('actualizar pedidoDet :',req.body);
  if(pedidoId && itemId && tipoItem && nombre){
    const oldPedidoDet = await Pedidodet.findOne({pedidoId:pedidoId,itemId:itemId})
    if(oldPedidoDet){
      console.log('oldPedidoDet',oldPedidoDet.pedidoId,oldPedidoDet.itemId);
      
      oldPedidoDet.nombre = nombre || oldPedidoDet.nombre;
      oldPedidoDet.consumo = consumo || oldPedidoDet.consumo;
      oldPedidoDet.tipoItem = tipoItem || oldPedidoDet.tipoItem;
      oldPedidoDet.stock = stock || oldPedidoDet.stock;
      oldPedidoDet.stockEmergencia = stockEmergencia || oldPedidoDet.stockEmergencia;
      oldPedidoDet.pedidoSys = pedidoSys || oldPedidoDet.pedidoSys;
      oldPedidoDet.pedidoSolicitado = pedidoSolicitado || oldPedidoDet.pedidoSolicitado;
      oldPedidoDet.pedidoConsolidado = pedidoConsolidado || oldPedidoDet.pedidoConsolidado;
      oldPedidoDet.itemAtendido = itemAtendido || oldPedidoDet.itemAtendido;
      oldPedidoDet.pesoBruto = pesoBruto || oldPedidoDet.pesoBruto;
     
      const updatedPedidoDet = await oldPedidoDet.save();
      console.log('updatedPedidoDet',updatedPedidoDet);
      res.send({
        _id:updatedPedidoDet._id,
        pedidoId:updatedPedidoDet.pedidoId,
        itemId:updatedPedidoDet.itemId,
        tipoItem:updatedPedidoDet.tipoItem,
        nombre:updatedPedidoDet.nombre,
        consumo:updatedPedidoDet.consumo,
        stock:updatedPedidoDet.stock,
        stockEmergencia:updatedPedidoDet.stockEmergencia,
        pedidoSys:updatedPedidoDet.pedidoSys,
        pedidoSolicitado:updatedPedidoDet.pedidoSolicitado,
        pedidoConsolidado:updatedPedidoDet.pedidoConsolidado,
        itemAtendido:updatedPedidoDet.itemAtendido,
        pesoBruto:updatedPedidoDet.pesoBruto,
      
      })
    }else{
      res.status(400).send({ message: 'Error de Actualizacion: Pedido Detalle NO existe.' });
      console.log('Error de Actualizacion: Pedido Detalle NO existe.',pedidoId);
    }
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Falta Parametro.' });
    console.log('Error de Actualizacion: Falta Parametro.',pedidoId);
  }
});

module.exports = router;