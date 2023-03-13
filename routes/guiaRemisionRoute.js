const express = require('express');
const Guiaremision = require('../models/guiaremisionModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
const {outGuiaReKardex} = require('../components/outGuiaReKardex');
const {inGuiaReKardex} = require('../components/inGuiaReKardex');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const guiasremision = await Guiaremision.find({}).sort({ "nombre": -1 }).limit(100);
  if(guiasremision){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(guiasremision);
    //console.log('recetas',guiasremision)
  }else{
    res.status(404).send({ message: 'Guias Remision no encontradas' });
    console.log('Guias Remision no encontradas',guiasremision)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get guiasremision Id', req.params )
  const {id} = req.params;
  const guiaremision = await Guiaremision.find({}).sort({ "nombre": -1 }).limit(100);
  if(guiaremision){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(guiaremision);
    console.log('guiaremision',guiaremision)
  }else{
    res.status(404).send({ message: 'Guiaremision no encontrada' });
    console.log('Guiaremision no encontrada',guiaremision)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {guiaremision} = req.body
  const guiasremision = await Guiaremision.find({ 'nombre': { $regex: guiaremision, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(guiasremision){
    res.send(guiasremision);
    console.log('guiasremision',guiasremision)
  }else{
    res.status(404).send({ message: 'guiasremision no encontrados' });
    console.log('Guias remision no encontradas', guiasremision );
    
  }
});

/* Obtenemos los registros que tienen la sucursal solicitada y los estados que vienen en el arreglo */
router.post("/estado", isAuth, async (req, res) => {
  console.log('get guiasremision estado', req.body )
  const {estados,sucursal} = req.body
  //const guiasremision = await Guiaremision.find({ 'estado': estado}).sort({ "nombre": -1 }).limit(200);
  const guiasremision = await Guiaremision.find({'destino':sucursal, 'estado':{$in:estados}}).sort({ "updatedAt": -1 }).limit(100);
  console.log('guiasremision',guiasremision);
  //if(guiasremision.length>0){
  if(guiasremision){
    res.send(guiasremision);
    console.log('guiasremision',guiasremision)
  }else{
    res.status(404).send({ message: 'Guias remision no encontrados' });
    console.log('Guias remision no encontradas', guiasremision ); 
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre,fecha,destino,origen,items,observacionEnvio,chofer,transporte,usuarioEnvio,isEnvioGrupal,estado,isEnvioPorcion,repartePorSolId,reparteUndSolId,repartidorTipo} = req.body;
  console.log('registrar guiaremision :',req.body);
  const oldGuiaremision = await Guiaremision.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldGuiaremision){
    res.status(400).send({ message: 'Error: Guiaremision ya existe.' });
  }else{
    const guiaRemisionId = await getSecuencia("GuiaRemision");
    console.log('guiaRemisionId',guiaRemisionId);
    const guiaremision = new Guiaremision({
        guiaRemisionId:guiaRemisionId,
        repartePorSolId:repartePorSolId,
        reparteUndSolId:reparteUndSolId,
        repartidorTipo: repartidorTipo,
        nombre: nombre,
        fecha: fecha,
        destino: destino,
        origen: origen,
        items: items,
        observacionEnvio: observacionEnvio,
        chofer: chofer,
        transporte: transporte,
        usuarioEnvio: usuarioEnvio,
        isEnvioGrupal: isEnvioGrupal,
        isEnvioPorcion: isEnvioPorcion,
        estado: estado,
    });
    const newGuiaremision = await guiaremision.save();
    console.log('newGuiaremision',newGuiaremision);
    /* Ojo se esta traslando a la funcion salidalotekardexDetalle */
    //const v_saveGuiaReKardex = await outGuiaReKardex(items,origen,destino,fecha)
    //console.log('v_saveGuiaReKardex',v_saveGuiaReKardex);
    res.send({
      _id:newGuiaremision._id,
      guiaRemisionId:newGuiaremision.guiaRemisionId,
      repartePorSolId:newGuiaremision.repartePorSolId,
      reparteUndSolId:newGuiaremision.reparteUndSolId,
      repartidorTipo:newGuiaremision.repartidorTipo,
      nombre:newGuiaremision.nombre,
      fecha:newGuiaremision.fecha,
      destino:newGuiaremision.destino,
      origen:newGuiaremision.origen,
      items:newGuiaremision.items,
      observacionEnvio:newGuiaremision.observacionEnvio,
      chofer:newGuiaremision.chofer,
      transporte:newGuiaremision.transporte,
      usuarioEnvio:newGuiaremision.usuarioEnvio,
      isEnvioGrupal:newGuiaremision.isEnvioGrupal,
      isEnvioPorcion:newGuiaremision.isEnvioPorcion,
      estado:newGuiaremision.estado,
    })
    
  }
});

router.put('/actualizar', async (req, res) => {
  var {guiaRemisionId,nombre,fecha,destino,origen,items,observacionEnvio,observacionRecepcion,chofer,transporte,usuarioEnvio,usuarioReceptor,isEnvioGrupal,isEnvioPorcion,estado,guiaEnviado,isSaveKardex,isIngresoKardex,repartePorSolId} = req.body;
  console.log('actualizar guiaremision :',req.body);
  const oldGuiaremision = await Guiaremision.findOne({guiaRemisionId:guiaRemisionId})
  if(oldGuiaremision){
    console.log('guiaRemisionId',oldGuiaremision.guiaRemisionId);
    console.log('oldGuiaremision.items',oldGuiaremision.items);
    let originalGuiaRemision = oldGuiaremision
    let originalGuiaRemisionItems = oldGuiaremision.items
    console.log('originalGuiaRemision',originalGuiaRemision);
    console.log('originalGuiaRemisionItems',originalGuiaRemisionItems);
    oldGuiaremision.nombre = nombre || oldGuiaremision.nombre;
    oldGuiaremision.fecha = fecha || oldGuiaremision.fecha;
    oldGuiaremision.destino = destino || oldGuiaremision.destino;
    oldGuiaremision.origen = origen || oldGuiaremision.origen;
    oldGuiaremision.items = items || oldGuiaremision.items;
    oldGuiaremision.observacionEnvio = observacionEnvio || oldGuiaremision.observacionEnvio;
    oldGuiaremision.observacionRecepcion = observacionRecepcion || oldGuiaremision.observacionRecepcion;
    oldGuiaremision.chofer = chofer || oldGuiaremision.chofer;
    oldGuiaremision.transporte = transporte || oldGuiaremision.chofer;
    oldGuiaremision.usuarioEnvio = usuarioEnvio || oldGuiaremision.usuarioEnvio;
    oldGuiaremision.usuarioReceptor = usuarioReceptor || oldGuiaremision.usuarioReceptor;
    oldGuiaremision.isEnvioGrupal = isEnvioGrupal || oldGuiaremision.isEnvioGrupal;
    oldGuiaremision.isEnvioPorcion = isEnvioPorcion || oldGuiaremision.isEnvioPorcion;
    oldGuiaremision.estado = estado || oldGuiaremision.estado;
   
    const updatedGuiaremision = await oldGuiaremision.save();
    console.log('updatedGuiaremision',updatedGuiaremision);
    if(isSaveKardex){
      console.log('isSaveKardex True',isSaveKardex);
      if(isIngresoKardex){
        console.log('isIngresoKardex True',isIngresoKardex);
        const v_saveGuiaReKardex = await inGuiaReKardex(items,origen,destino,fecha,originalGuiaRemisionItems,guiaEnviado,isEnvioPorcion)
        console.log('v_saveGuiaReKardex',v_saveGuiaReKardex);
      }
    }
    res.send({
      _id:updatedGuiaremision._id,
      guiaRemisionId:updatedGuiaremision.guiaRemisionId,
      repartePorSolId:updatedGuiaremision.repartePorSolId,
      reparteUndSolId:updatedGuiaremision.reparteUndSolId,
      nombre:updatedGuiaremision.nombre,
      fecha:updatedGuiaremision.fecha,
      destino:updatedGuiaremision.destino,
      origen:updatedGuiaremision.origen,
      items:updatedGuiaremision.items,
      observacionEnvio:updatedGuiaremision.observacionEnvio,
      observacionRecepcion:updatedGuiaremision.observacionRecepcion,
      chofer:updatedGuiaremision.chofer,
      transporte:updatedGuiaremision.transporte,
      usuarioEnvio:updatedGuiaremision.usuarioEnvio,
      usuarioReceptor:updatedGuiaremision.usuarioReceptor,
      estado:updatedGuiaremision.estado,
      isEnvioGrupal:updatedGuiaremision.isEnvioGrupal,
      isEnvioPorcion:updatedGuiaremision.isEnvioPorcion,
      
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Guiaremision NO existe.' });
    console.log('Error de Actualizacion: Guiaremision NO existe.');
  }
});

module.exports = router;