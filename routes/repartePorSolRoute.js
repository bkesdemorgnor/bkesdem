const express = require('express');
const Reparteporsol = require('../models/repartePorSolModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
//const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();

/* Modulo que almacena todos las solicitudes de Pedidos de porciones */

router.get("/", isAuth, async (req, res) => {
  console.log('get RepartePorSolicitudes req.body:', req.body )
  const reparteporsols = await Reparteporsol.find({}).sort({ "nombre": -1 }).limit(100);
  if(reparteporsols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteporsols);
    console.log('get RepartePorSolicitudes ',reparteporsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidor no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',reparteporsols)
  }
});

router.get("/:repartePorSolId", isAuth, async (req, res) => {
  console.log('get reparteporsol Id', req.params )
  const {repartePorSolId} = req.params;
  const reparteporsol = await Reparteporsol.find({repartePorSolId:repartePorSolId}).sort({ "nombre": -1 }).limit(100);
  if(reparteporsol){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteporsol);
    console.log('porciones',reparteporsol)
  }else{
    res.status(404).send({ message: 'Solicitud de pedidos no encontrados' });
    console.log('Solicitud de Repartidores no encontrados',reparteporsol)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {reparteporsol} = req.body
  const reparteporsols = await Reparteporsol.find({ 'nombre': { $regex: reparteporsol, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(reparteporsols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteporsols);
    //console.log('reparteporsols',reparteporsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteporsols));
    
  }
});


router.post("/fecha", isAuth, async (req, res) => {
  console.log('get repartePorSol req.body', req.body )
  const {fecha} = req.body
  const reparteporsols = await Reparteporsol.find({ 'fechaEntrega': fecha }).sort({ "createdAt": -1 }).limit(100);
  if(reparteporsols){ 
    res.send(reparteporsols);
    console.log('reparteporsols',reparteporsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteporsols));
    
  }
});


router.post("/estado", isAuth, async (req, res) => {
  console.log('estado repartePorSol req.body', req.body )
  const {estados} = req.body
  //const reparteporsols = await Reparteporsol.find({ 'estado': estado }).sort({ "createdAt": -1 }).limit(100);
  const reparteporsols = await Reparteporsol.find({ 'estado':{$in:estados}}).sort({ "updatedAt": -1 }).limit(100);

  if(reparteporsols){ 
    res.send(reparteporsols);
    console.log('reparteporsols',reparteporsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteporsols));
    
  }
});


router.post('/registrar', async (req, res) => {
  var {fecha, fechaEntrega, estado,porcionesSol,grupo,nombre,repartidorPorId,isEnvioGrupal,isEnvioPorcion,repartidorTipo } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('repartePorSol registrar req.body',req.body);
  const oldRepartePorSol = await Reparteporsol.findOne({fechaEntrega:fechaEntrega,repartidorPorId:repartidorPorId})
  if(oldRepartePorSol){
    res.status(400).send({ message: 'Error: Solicitud de Repartidor ya existe.' });
  }else{
    const repartePorSolId = await getSecuencia("RepartePorSol");
    console.log('repartePorSolId',repartePorSolId);
    const reparteporsol = new Reparteporsol({
        repartePorSolId:repartePorSolId,
        repartidorPorId:repartidorPorId,
        repartidorTipo:repartidorTipo,
        fecha: fecha,
        fechaEntrega:fechaEntrega,
        estado:estado,
        grupo:grupo,
        nombre:nombre,
        isEnvioGrupal:isEnvioGrupal,
        isEnvioPorcion:isEnvioPorcion,
        porcionesSol:porcionesSol,
    });
    const newRepartePorSol = await reparteporsol.save();
    if (newRepartePorSol) {
      
      console.log('newRepartePorSol',newRepartePorSol);
      res.send({
        _id: newRepartePorSol._id,
        repartePorSolId: newRepartePorSol.repartePorSolId,
        repartidorPorId: newRepartePorSol.repartidorPorId,
        repartidorTipo: newRepartePorSol.repartidorTipo,
        fecha: newRepartePorSol.fecha,
        fechaEntrega: newRepartePorSol.fechaEntrega,
        estado: newRepartePorSol.estado,
        grupo: newRepartePorSol.grupo,
        nombre: newRepartePorSol.nombre,
        isEnvioGrupal: newRepartePorSol.isEnvioGrupal,
        isEnvioPorcion: newRepartePorSol.isEnvioPorcion,
        porcionesSol: newRepartePorSol.porcionesSol,
      })
    } else {
      res.status(401).send({ message: 'Datos de Solicitud de Repartidor invalidos.' });
    }
  }
});

/* Actualizar el registro de reparte Porcion solicitudes, principalmente los estados.
 */
router.put('/actualizar', async (req, res) => {
  var {repartePorSolId,fecha, fechaEntrega, estado,porcionesSol } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('repartePorSol registrar req.body',req.body);
  const oldRepartePorSol = await Reparteporsol.findOne({repartePorSolId:repartePorSolId})
  if(oldRepartePorSol){
    
    oldRepartePorSol.fecha= fecha;
    oldRepartePorSol.fechaEntrega=fechaEntrega;
    oldRepartePorSol.estado=estado;
    oldRepartePorSol.porcionesSol=porcionesSol;
    
    const newRepartePorSol = await oldRepartePorSol.save();
    if (newRepartePorSol) {
      
      console.log('newRepartePorSol',newRepartePorSol);
      res.send({
        _id: newRepartePorSol._id,
        repartePorSolId: newRepartePorSol.repartePorSolId,
        fecha: newRepartePorSol.fecha,
        fechaEntrega: newRepartePorSol.fechaEntrega,
        estado: newRepartePorSol.estado,
        porcionesSol: newRepartePorSol.porcionesSol,
      })
    } else {
      res.status(404).send({ message: 'Datos de Solicitud de Repartidor invalidos.' });
    }
  }else{
    res.status(400).send({ message: 'Error: Solicitud de Repartidor ya existe.' });
  }
});

module.exports = router;