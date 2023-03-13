const express = require('express');
const Transfersol = require('../models/transferSolModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const transfersols = await Transfersol.find({}).sort({ "nombre": -1 }).limit(100);
  if(transfersols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transfersols);
    //console.log('recetas',transfersols)
  }else{
    res.status(404).send({ message: 'Recetas no encontradas' });
    console.log('Recetas no encontradas',transfersols)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get transfersols Id', req.params )
  const {id} = req.params;
  const transfersol = await Transfersol.find({}).sort({ "nombre": -1 }).limit(100);
  if(transfersol){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transfersol);
    console.log('transfersol',transfersol)
  }else{
    res.status(404).send({ message: 'Transfersol no encontrada' });
    console.log('Transfersol no encontrada',transfersol)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {transfersol} = req.body
  const transfersols = await Transfersol.find({ 'nombre': { $regex: transfersol, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(transfersols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transfersols);
    //console.log('transfersols',transfersols)
  }else{
    res.status(404).send({ message: 'transfersols no encontrados' });
    console.log('transfersols no encontradas', transfersols );
    
  }
});


router.post("/sucursalsol", isAuth, async (req, res) => {
  console.log('get transfersols estado', req.body )
  const {sucursalSol,isActivo} = req.body
  const transfersols = await Transfersol.find({ 'sucursalSol': sucursalSol,isActivo:isActivo}).sort({ "createdAt": -1 }).limit(200);
  if(transfersols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transfersols);
    console.log('transfersols',transfersols)
  }else{
    res.status(404).send({ message: 'transfersols no encontrados' });
    console.log('transfersols no encontradas', transfersols );
    
  }
});


router.get("/activos", isAuth, async (req, res) => {
  console.log('get transfersols activos', req.body )
  
  const transfersols = await Transfersol.find({ isActivo:true}).sort({ "createdAt": -1 }).limit(200);
  if(transfersols){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(transfersols);
    console.log('transfersols',transfersols)
  }else{
    res.status(404).send({ message: 'transfersols no encontrados' });
    console.log('transfersols no encontradas', transfersols );
    
  }
});

router.post('/registrar', async (req, res) => {
  var { fechaSol,mensaje,sucursalSol,unidadesSol,isActivo,estado,isAutorizado} = req.body;
  console.log('registrar transfersol :',req.body);
  
    const transferSolId = await getSecuencia("TransferSol");
    console.log('transferSolId',transferSolId);
    const transfersol = new Transfersol({
        transferSolId:transferSolId,
        fechaSol: fechaSol,
        mensaje: mensaje,
        sucursalSol: sucursalSol,
        estado: estado,
        unidadesSol: unidadesSol,
        isActivo: isActivo,
        isAutorizado: isAutorizado,
     });
    const newTransferSol = await transfersol.save();
    console.log('newTransferSol',newTransferSol);
    res.send({
      _id:newTransferSol._id,
      transferSolId:newTransferSol.transferSolId,
      fechaSol:newTransferSol.fechaSol,
      mensaje:newTransferSol.mensaje,
      sucursalSol:newTransferSol.sucursalSol,
      estado:newTransferSol.estado,
      unidadesSol:newTransferSol.unidadesSol,
      isActivo:newTransferSol.isActivo,
      isAutorizado:newTransferSol.isAutorizado,
    })
    
  
});

router.put('/actualizar', async (req, res) => {
  var {transferSolId,isActivo,estado,unidadesAte,isAutorizado} = req.body;
  console.log('actualizar transfersol :',req.body);
  const oldTransfersol = await Transfersol.findOne({transferSolId:transferSolId})
  if(oldCarta){
    console.log('transferSolId',oldTransfersol.transferSolId);
    
    oldTransfersol.estado = estado || oldTransfersol.estado;
    oldTransfersol.isActivo = isActivo || oldTransfersol.isActivo;
    oldTransfersol.isAutorizado = isAutorizado || oldTransfersol.isAutorizado;
    oldTransfersol.unidadesSol = unidadesSol || oldTransfersol.unidadesSol;
    oldTransfersol.unidadesAte = unidadesAte || oldTransfersol.unidadesAte;
    
    const updatedTransfersol = await oldTransfersol.save();
    console.log('updatedTransfersol',updatedTransfersol);
    res.send({
      _id:updatedTransfersol._id,
      transferSolId:updatedTransfersol.transferSolId,
      fechaSol:updatedTransfersol.fechaSol,
      mensaje:updatedTransfersol.mensaje,
      sucursalSol:updatedTransfersol.sucursalSol,
      unidadesSol:updatedTransfersol.unidadesSol,
      unidadesAte:updatedTransfersol.unidadesAte,
      isActivo:updatedTransfersol.isActivo,
      isAutorizado:updatedTransfersol.isAutorizado,
      estado:updatedTransfersol.estado,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Transfersol NO existe.' });
    console.log('Error de Actualizacion: Transfersol NO existe.',oldTransfersol);
  }
});

module.exports = router;