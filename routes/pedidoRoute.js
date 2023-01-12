const express = require('express');
const Pedido = require('../models/pedidoModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
const {addPedidosDet} = require('../components/addPedidosDet');
//const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const pedidos = await Pedido.find({}).sort({ "nombre": -1 }).limit(100);
  if(pedidos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidos);
    console.log('pedidos',pedidos)
  }else{
    res.status(404).send({ message: 'Pedidos no encontrados' });
    console.log('Pedidos no encontrados',pedidos)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get pedido Id', req.params )
  const {id} = req.params;
  const pedidos = await Pedido.find({}).sort({ "nombre": -1 }).limit(100);
  if(pedidos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidos);
    console.log('pedidos',pedidos)
  }else{
    res.status(404).send({ message: 'pedidos no encontrados' });
    console.log('Pedidos no encontrados',pedidos)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {pedido} = req.body
  const pedidos = await Pedido.find({ 'nombre': { $regex: pedido, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(pedidos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidos);
    console.log('pedidos',pedidos)
  }else{
    res.status(404).send({ message: 'Pedidos no encontrados' });
    console.log('Pedidos no encontrados',    res.send(pedidos));
    
  }
});

// Devuelve todos los pedidos que tengan el estado solicitado
router.post("/estado", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {estado} = req.body
  const pedidos = await Pedido.find({'estado':estado} ).sort({ "updatedAt": -1 }).limit(100);
  if(pedidos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pedidos);
    console.log('pedidos',pedidos)
  }else{
    res.status(404).send({ message: 'Pedidos no encontrados' });
    console.log('Pedidos no encontrados',    res.send(pedidos));
    
  }
});

router.post('/registrar', async (req, res) => {
    console.log('registrar req.body',req.body);
  var {nombre,fechaPedido,grupoDeCompra,dias,sucursal,pedformId,estado, descripcion, isActivo,formulario } = req.body;
  if (nombre && fechaPedido && grupoDeCompra && dias,sucursal && pedformId && estado && descripcion && isActivo && formulario ){
    //nombre = nombre.toUpperCase()
    const oldPedido = await Pedido.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' },fechaPedido:fechaPedido,sucursal:sucursal,grupoDeCompra:grupoDeCompra})
    if(oldPedido){
      res.status(400).send({ message: 'Error: Pedido ya existe.' });
    }else{
      const pedidoId = await getSecuencia("Pedido");
      console.log('pedidoId',pedidoId);
      const pedido = new Pedido({
        pedidoId:pedidoId,
        nombre: nombre,
        fechaPedido: fechaPedido,
        grupoDeCompra: grupoDeCompra,
        dias: dias,
        sucursal: sucursal,
        estado: estado,
        descripcion:descripcion,
        isActivo:isActivo,
        pedformId:pedformId,
        formulario:formulario,
      });
      const newPedido = await pedido.save();
      if (newPedido) {
        await addPedidosDet(pedformId,newPedido);
        console.log('newPedido',newPedido);
        res.send({
          _id: newPedido._id,
          pedidoId: newPedido.pedidoId,
          nombre: newPedido.nombre,
          fechaPedido: newPedido.fechaPedido,
          grupoDeCompra: newPedido.grupoDeCompra,
          dias: newPedido.dias,
          sucursal: newPedido.sucursal,
          estado: newPedido.estado,
          descripcion: newPedido.descripcion,
          isActivo: newPedido.isActivo,
          formulario: newPedido.formulario,
        })
      } else {
        res.status(401).send({ message: 'Datos de Pedido invalidos.' });
      }
    }
  }else{
    res.status(401).send({ message: 'Faltan Datos de Pedido.' });
  }
});


router.put('/actualizar', async (req, res) => {
  var {pedidoId,nombre, fechaPedido,grupoDeCompra,dias,sucursal,estado,descripcion,isActivo,formulario} = req.body;
  console.log('actualizar pedido :',req.body);
  const oldPedido = await Pedido.findOne({pedidoId:pedidoId})
  if(oldPedido){
    console.log('oldPedido pedidoId:',oldPedido.pedidoId);
    
    oldPedido.nombre = nombre || oldPedido.nombre;
    oldPedido.fechaPedido = fechaPedido || oldPedido.fechaPedido;
    oldPedido.grupoDeCompra = grupoDeCompra || oldPedido.grupoDeCompra;
    oldPedido.dias = dias || oldPedido.dias;
    oldPedido.sucursal = sucursal || oldPedido.sucursal;
    oldPedido.estado = estado || oldPedido.estado;
    oldPedido.descripcion = descripcion || oldPedido.descripcion;
    oldPedido.isActivo = isActivo || oldPedido.isActivo;
    oldPedido.formulario = formulario || oldPedido.formulario;
   
    const updatedPedido = await oldPedido.save();
    console.log('updatedPedido',updatedPedido);
    res.send({
      _id:updatedPedido._id,
      pedidoId:updatedPedido.pedidoId,
      nombre:updatedPedido.nombre,
      fechaPedido:updatedPedido.fechaPedido,
      grupoDeCompra:updatedPedido.grupoDeCompra,
      dias:updatedPedido.dias,
      sucursal:updatedPedido.sucursal,
      estado:updatedPedido.estado,
      descripcion:updatedPedido.descripcion,
      isActivo:updatedPedido.isActivo,
      formulario:updatedPedido.formulario,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion:Pedido NO existe.' });
    console.log('Error de Actualizacion: Pedido NO existe.',oldPedido);
  }
});


module.exports = router;