const express = require('express');
const Reparteundsol = require('../models/reparteUndSolModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
//const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();

/* Modulo que almacena todos las solicitudes de Pedidos de unidades */

router.get("/", isAuth, async (req, res) => {
  console.log('get ReparteUndSolicitudes req.body:', req.body )
  const reparteundsols = await Reparteundsol.find({}).sort({ "nombre": -1 }).limit(100);
  if(reparteundsols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteundsols);
    console.log('get ReparteUndSolicitudes ',reparteundsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidor no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',reparteundsols)
  }
});

router.get("/:reparteUndSolId", isAuth, async (req, res) => {
  console.log('get reparteundsol Id', req.params )
  const {reparteUndSolId} = req.params;
  const reparteundsol = await Reparteundsol.find({reparteUndSolId:reparteUndSolId}).sort({ "nombre": -1 }).limit(100);
  if(reparteundsol){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteundsol);
    console.log('unidades',reparteundsol)
  }else{
    res.status(404).send({ message: 'Solicitud de unidades no encontrados' });
    console.log('Solicitud de Repartidores no encontrados',reparteundsol)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {reparteundsol} = req.body
  const reparteundsols = await Reparteundsol.find({ 'nombre': { $regex: reparteundsol, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(reparteundsols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(reparteundsols);
    //console.log('reparteundsols',reparteundsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteundsols));
    
  }
});


router.post("/fecha", isAuth, async (req, res) => {
  console.log('get reparteUndSol req.body', req.body )
  const {fecha} = req.body
  const reparteundsols = await Reparteundsol.find({ 'fechaEntrega': fecha }).sort({ "createdAt": -1 }).limit(100);
  if(reparteundsols){ 
    res.send(reparteundsols);
    console.log('reparteundsols',reparteundsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteundsols));
    
  }
});


router.post("/estado", isAuth, async (req, res) => {
  console.log('estado reparteUndSol req.body', req.body )
  const {estados} = req.body
  //const reparteundsols = await Reparteundsol.find({ 'estado': estado }).sort({ "createdAt": -1 }).limit(100);
  const reparteundsols = await Reparteundsol.find({ 'estado':{$in:estados}}).sort({ "updatedAt": -1 }).limit(100);

  if(reparteundsols){ 
    res.send(reparteundsols);
    console.log('reparteundsols',reparteundsols)
  }else{
    res.status(404).send({ message: 'Solicitudes de Repartidores no encontrados' });
    console.log('Solicitudes de Repartidores no encontrados',    res.send(reparteundsols));
    
  }
});


router.post('/registrar', async (req, res) => {
  var {fecha, fechaEntrega, estado,unidadesSol,grupo,nombre,repartidorUndId,isEnvioGrupal,isEnvioPorcion,repartidorTipo } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('reparteUndSol registrar req.body',req.body);
  const oldReparteUndSol = await Reparteundsol.findOne({fechaEntrega:fechaEntrega,repartidorUndId:repartidorUndId})
  if(oldReparteUndSol){
    res.status(400).send({ message: 'Error: Solicitud de Repartidor ya existe.' });
  }else{
    const reparteUndSolId = await getSecuencia("ReparteUndSol");
    console.log('reparteUndSolId',reparteUndSolId);
    const reparteundsol = new Reparteundsol({
        reparteUndSolId:reparteUndSolId,
        repartidorUndId:repartidorUndId,
        repartidorTipo:repartidorTipo,
        fecha: fecha,
        fechaEntrega:fechaEntrega,
        estado:estado,
        grupo:grupo,
        nombre:nombre,
        isEnvioGrupal:isEnvioGrupal,
        isEnvioPorcion:isEnvioPorcion,
        unidadesSol:unidadesSol,
    });
    const newReparteUndSol = await reparteundsol.save();
    if (newReparteUndSol) {
      
      console.log('newReparteUndSol',newReparteUndSol);
      res.send({
        _id: newReparteUndSol._id,
        reparteUndSolId: newReparteUndSol.reparteUndSolId,
        repartidorUndId: newReparteUndSol.repartidorUndId,
        repartidorTipo: newReparteUndSol.repartidorTipo,
        fecha: newReparteUndSol.fecha,
        fechaEntrega: newReparteUndSol.fechaEntrega,
        estado: newReparteUndSol.estado,
        grupo: newReparteUndSol.grupo,
        nombre: newReparteUndSol.nombre,
        isEnvioGrupal: newReparteUndSol.isEnvioGrupal,
        isEnvioPorcion: newReparteUndSol.isEnvioPorcion,
        unidadesSol: newReparteUndSol.unidadesSol,
      })
    } else {
      res.status(401).send({ message: 'Datos de Solicitud de Repartidor invalidos.' });
    }
  }
});

/* Actualizar el registro de reparte Porcion solicitudes, principalmente los estados.
 */
router.put('/actualizar', async (req, res) => {
  var {reparteUndSolId,fecha, fechaEntrega, estado,unidadesSol } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('reparteUndSol registrar req.body',req.body);
  const oldReparteUndSol = await Reparteundsol.findOne({reparteUndSolId:reparteUndSolId})
  if(oldReparteUndSol){
    
    oldReparteUndSol.fecha= fecha;
    oldReparteUndSol.fechaEntrega=fechaEntrega;
    oldReparteUndSol.estado=estado;
    oldReparteUndSol.unidadesSol=unidadesSol;
    
    const newReparteUndSol = await oldReparteUndSol.save();
    if (newReparteUndSol) {
      
      console.log('newReparteUndSol',newReparteUndSol);
      res.send({
        _id: newReparteUndSol._id,
        reparteUndSolId: newReparteUndSol.reparteUndSolId,
        fecha: newReparteUndSol.fecha,
        fechaEntrega: newReparteUndSol.fechaEntrega,
        estado: newReparteUndSol.estado,
        unidadesSol: newReparteUndSol.unidadesSol,
      })
    } else {
      res.status(404).send({ message: 'Datos de Solicitud de Repartidor invalidos.' });
    }
  }else{
    res.status(400).send({ message: 'Error: Solicitud de Repartidor ya existe.' });
  }
});

module.exports = router;