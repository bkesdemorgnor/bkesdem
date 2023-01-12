const express = require('express');
const Carta = require('../models/cartaModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const cartas = await Carta.find({}).sort({ "nombre": -1 }).limit(100);
  if(cartas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cartas);
    //console.log('recetas',cartas)
  }else{
    res.status(404).send({ message: 'Recetas no encontradas' });
    console.log('Recetas no encontradas',cartas)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get cartas Id', req.params )
  const {id} = req.params;
  const carta = await Carta.find({}).sort({ "nombre": -1 }).limit(100);
  if(carta){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(carta);
    console.log('carta',carta)
  }else{
    res.status(404).send({ message: 'Carta no encontrada' });
    console.log('Carta no encontrada',carta)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {carta} = req.body
  const cartas = await Carta.find({ 'nombre': { $regex: carta, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(cartas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cartas);
    //console.log('cartas',cartas)
  }else{
    res.status(404).send({ message: 'cartas no encontrados' });
    console.log('cartas no encontradas', cartas );
    
  }
});


router.post("/estado", isAuth, async (req, res) => {
  console.log('get cartas estado', req.body )
  const {estado} = req.body
  const cartas = await Carta.find({ 'estado': estado}).sort({ "nombre": -1 }).limit(200);
  if(cartas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cartas);
    //console.log('cartas',cartas)
  }else{
    res.status(404).send({ message: 'cartas no encontrados' });
    console.log('cartas no encontradas', cartas );
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, categoria,precio,recetaId,recetaNombre,isSys,isActivo,estado} = req.body;
  console.log('registrar carta :',req.body);
  const oldCarta = await Carta.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldCarta){
    res.status(400).send({ message: 'Error: Carta ya existe.' });
  }else{
    const cartaId = await getSecuencia("Carta");
    console.log('cartaId',cartaId);
    const carta = new Carta({
        cartaId:cartaId,
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        recetaId: recetaId,
        recetaNombre: recetaNombre,
        isSys: isSys,
        isActivo: isActivo,
        estado: estado,
    });
    const newCarta = await carta.save();
    console.log('newCarta',newCarta);
    res.send({
      _id:newCarta._id,
      cartaId:newCarta.cartaId,
      nombre:newCarta.nombre,
      categoria:newCarta.categoria,
      precio:newCarta.precio,
      recetaId:newCarta.recetaId,
      recetaNombre:newCarta.recetaNombre,
      isSys:newCarta.isSys,
      isActivo:newCarta.isActivo,
      estado:newCarta.estado,
    })
    
  }
});

router.put('/actualizar', async (req, res) => {
  var {cartaId,nombre, categoria,precio,recetaId,recetaNombre,isSys,isActivo,estado} = req.body;
  console.log('actualizar carta :',req.body);
  const oldCarta = await Carta.findOne({cartaId:cartaId})
  if(oldCarta){
    console.log('cartaId',oldCarta.cartaId);
    
    oldCarta.nombre = nombre || oldCarta.nombre;
    oldCarta.categoria = categoria || oldCarta.categoria;
    oldCarta.precio = precio || oldCarta.precio;
    oldCarta.recetaId = recetaId || oldCarta.recetaId;
    oldCarta.recetaNombre = recetaNombre || oldCarta.recetaNombre;
    oldCarta.isSys = isSys || oldCarta.isSys;
    oldCarta.isActivo = isActivo || oldCarta.isActivo;
    oldCarta.estado = estado || oldCarta.estado;
   
    const updatedCarta = await oldCarta.save();
    console.log('updatedCarta',updatedCarta);
    res.send({
      _id:updatedCarta._id,
      cartaId:updatedCarta.cartaId,
      nombre:updatedCarta.nombre,
      categoria:updatedCarta.categoria,
      precio:updatedCarta.precio,
      recetaId:updatedCarta.recetaId,
      recetaNombre:updatedCarta.recetaNombre,
      isSys:updatedCarta.isSys,
      isActivo:updatedCarta.isActivo,
      estado:updatedCarta.estado,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Carta NO existe.' });
    console.log('Error de Actualizacion: Carta NO existe.',oldCarta.cartaId);
  }
});

module.exports = router;