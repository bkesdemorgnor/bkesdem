const express = require('express');
const Ordencompra = require('../models/ordencompraModel');
const { getSecuencia } = require('../components/GetSecuencia');
//const Ordencompradet = require('../models/ordencompradetModel');
const {addOCPDetalles} = require('../components/addOCPDetalles');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const ordenes = await Ordencompra.find({}).sort({ "updatedAt": -1 }).limit(200);
  if(ordenes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ordenes);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Ordenes de compra no encontrados' });
  }
});


router.post("/sucursal", isAuth, async (req, res) => {
  console.log('Orden de Compra get sucursal body', req.body)
  const {sucursal} = req.body;
  
  const ordenes = await Ordencompra.find({sucursal:sucursal}).sort({ "updatedAt": -1 }).limit(200);
  if(ordenes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ordenes);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Orden de Compra no encontrados' });
  }
});

router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {ordenCompra,sucursal} = req.body
  const ordenes = await Ordencompra.find({ 'sucursal':sucursal,'nombre': { $regex: ordenCompra, $options : "i"} }).sort({ "updatedAt": -1 }).limit(100);
  if(ordenes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    console.log('Buscar ordenes',ordenes)
    res.send(ordenes);
  }else{
    console.log('Buscar ordenes de compra no encontrados',ordenes);
    res.status(404).send({ message: 'ordenes de compra no encontrados' });
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  console.log('get ordenes de compra grupo', req.body )
  const {sucursal,grupoDeCompra} = req.body
  const ordenes = await Ordencompra.find({ 'sucursal':sucursal,'grupoDeCompra': grupoDeCompra }).sort({ "updatedAt": -1 }).limit(100);
  if(ordenes){
    console.log('Grupo ordenes de compra',ordenes)
    res.send(ordenes);
  }else{
    console.log('Grupo Kardexs no encontrados',   ordenes);
    res.status(404).send({ message: 'Grupo de ordenes de compra no encontrados' });
  }
});

router.post("/estado", isAuth, async (req, res) => {
  console.log('get ordenes de compra estado', req.body )
  const {estado} = req.body
  const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
  if(ordenes){
    console.log('Ordenes de compra con el estado',estado,ordenes)
    res.send(ordenes);
  }else{
    console.log('Ordenes de Compra no encontrados',   ordenes);
    res.status(404).send({ message: 'Ordenes de compra no encontrados' });
  }
});


router.post("/estados", isAuth, async (req, res) => {
  console.log('get ordenes de compra de varios estados', req.body )
  const {estados} = req.body
  //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
  const ordenes = await Ordencompra.find({ 'estado':{$in:[estados]}}).sort({ "updatedAt": -1 }).limit(100);

  if(ordenes){
    console.log('Ordenes de compra con los estados',estados,ordenes)
    res.send(ordenes);
  }else{
    console.log('Ordenes de Compra no encontrados',   ordenes);
    res.status(404).send({ message: 'Ordenes de compra no encontrados' });
  }
});


/*  Buscar todas las ordenes de compra que vengan uno o varios de los isFlag(isRecibido, isFormulado, isPresupuestado, isPagado)
  que viene con el estado true o false que soliciten 
*/
router.post("/isestados", isAuth, async (req, res) => {
  console.log('get ordenes de compra (true o false) de todos los isFlag solicitados:', req.body )
  const {isFlags, isEstados} = req.body
  console.log('isFlags',isFlags,'isEstados',isEstados);
  if(isFlags.length > 0){
    const findStr = isFlags.map((flg,idx)=>{
      console.log('flg',flg);
      const v_flg = flg
      if("isFormulado" === flg || "isRecibido" === flg || flg === "isPresupuestado" || flg === "isPagado" || flg === "isAuth"){
        switch(flg){
          case "isFormulado":
            console.log('isFormulado',flg);
            var v_isFlag = {isFormulado:isEstados[idx]}
            break;
          case "isRecibido":
            console.log('isRecibido',flg);
            var v_isFlag = {isRecibido:isEstados[idx]}
            break;
          case "isPresupuestado":
            console.log('isPresupuestado',flg);
            var v_isFlag = {isPresupuestado:isEstados[idx]}
            break;
          case "isPagado":
            console.log('isPagado',flg);
            var v_isFlag = {isPagado:isEstados[idx]}
            break;
          case "isAuth":
            console.log('isAuth',flg);
            var v_isFlag = {isAuth:isEstados[idx]}
            break;
          default:
            console.log('Error: Incorrecto estado');
        }
        
        console.log('v_isFlag',v_isFlag);
        return v_isFlag
      }
    })
    console.log('findStr',findStr);
    var ordenes = await Ordencompra.find({ $and : findStr}).sort({ "updatedAt": -1 }).limit(100);
    //console.log('Ordenes de compra',ordenes)
        
    if(ordenes){
      console.log('Ordenes de compra con isEstado',ordenes)
      res.send(ordenes);
    }else{
      console.log('Ordenes de Compra no encontrados',   ordenes);
      res.status(404).send({ message: 'Ordenes de compra no encontrados' });
    }
  }else{
    console.log('Error : Get orden de Compra - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get orden de Compra - isEstado incorrecto' });
  }
});


/*  Buscar todas las ordenes de compra del isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) que viene en isEstado 
    que tengan el isFlag en False 
*/
router.post("/isestado", isAuth, async (req, res) => {
  console.log('get ordenes de compra de del isEstado que solicitado si esta en true estados', req.body )
  const {isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado"){
    switch(isEstado){
      case "isFormulado":
        console.log('isFormulado');
        var ordenes = await Ordencompra.find({ "isFormulado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isRecibido":
        console.log('isRecibido');
        var ordenes = await Ordencompra.find({ "isRecibido":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPresupuestado":
        console.log('isPresupuestado');
        var ordenes = await Ordencompra.find({ "isPresupuestado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPagado":
        console.log('isPagado');
        var ordenes = await Ordencompra.find({ "isPagado":{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      default:
        console.log('Error Default Parametro isEstado Inconrrecto');
        //res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
    }
    //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
    //const ordenes = await Ordencompra.find({ isEstado:{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
  
    if(ordenes){
      console.log('Ordenes de compra con isEstado',isEstado,ordenes)
      res.send(ordenes);
    }else{
      console.log('Ordenes de Compra no encontrados',   ordenes);
      res.status(404).send({ message: 'Ordenes de compra no encontrados' });
    }

  }else{
    console.log('Error : Get orden de Compra - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get orden de Compra - isEstado incorrecto' });
  }
});

/*  Buscar todas las ordenes de compra del isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) que viene en isEstado 
    que tengan el isFlag en True 
*/
router.post("/isestadoon", isAuth, async (req, res) => {
  console.log('get ordenes de compra del isEstado solicitado si esta en true', req.body )
  const {isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado"){
    switch(isEstado){
      case "isFormulado":
        console.log('isFormulado');
        var ordenes = await Ordencompra.find({ "isFormulado":{$in : ["true",true]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isRecibido":
        console.log('isRecibido');
        var ordenes = await Ordencompra.find({ "isRecibido":{$in : ["true",true]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPresupuestado":
        console.log('isPresupuestado');
        var ordenes = await Ordencompra.find({ "isPresupuestado":{$in : ["true",true]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      case "isPagado":
        console.log('isPagado');
        var ordenes = await Ordencompra.find({ "isPagado":{$in : ["true",true]}}).sort({ "updatedAt": -1 }).limit(100);
        break;
      default:
        console.log('Error Default Parametro isEstado Inconrrecto');
        //res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
    }
    //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
    //const ordenes = await Ordencompra.find({ isEstado:{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
  
    if(ordenes){
      console.log('Ordenes de compra con isEstado',isEstado,ordenes)
      res.send(ordenes);
    }else{
      console.log('Ordenes de Compra no encontrados',   ordenes);
      res.status(404).send({ message: 'Ordenes de compra no encontrados' });
    }

  }else{
    console.log('Error : Get orden de Compra - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get orden de Compra - isEstado incorrecto' });
  }
});


// Poner el isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) recibido en isEstado en true
router.put("/isestadoon", isAuth, async (req, res) => {
  console.log('Poner true ordenes de compra del isEstado req.body', req.body )
  const {_id,isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado" || isEstado === "isAuth"){

    var ordenCompra = await Ordencompra.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
    if(ordenCompra){
      switch(isEstado){
        case "isFormulado":
          console.log('isFormulado');
          ordenCompra.isFormulado = true;
          break;
        case "isRecibido":
          console.log('isRecibido');
          ordenCompra.isRecibido = true;
          break;
        case "isPresupuestado":
          console.log('isPresupuestado');
          ordenCompra.isPresupuestado = true;
          break;
        case "isPagado":
          console.log('isPagado');
          ordenCompra.isPagado = true;
          break;
        case "isAuth":
          console.log('isAuth');
          ordenCompra.isAuth = true;
          break;
        default:
          console.log('Error Default Parametro isEstado Inconrrecto');
          //res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
      }
      const updatedOrdenCompra = await ordenCompra.save();
      if(updatedOrdenCompra){
        console.log('updateestado ordenes de compra',ordenCompra)
        res.send(ordenCompra);
      }else{
        console.log('Error en updateestado Orden de Compra',   ordenCompra);
        res.status(404).send({ message: 'Error en updateestado Orden de Compra' });
      }
    
    }else{
      console.log('Orden de Compra no encontrado',   ordenCompra);
      res.status(404).send({ message: 'Orden de Compra no encontrado' });
    }
    //const ordenes = await Ordencompra.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
    //const ordenes = await Ordencompra.find({ isEstado:{$in : ["false",false]}}).sort({ "updatedAt": -1 }).limit(100);
  
   

  }else{
    console.log('Error : Get orden de Compra - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Get orden de Compra - isEstado incorrecto' });
  }
});


// Poner el lote de _id's el isFlag(isRecibido, isFormulado, isPresupuestado, isPagado) recibido en isEstado en true
router.put("/isestadoloteon", isAuth, async (req, res) => {
  console.log('Poner el lote _id el isEstado en true req.body', req.body )
  const {loteId,isEstado} = req.body
  console.log('isEstado',isEstado);
  if("isFormulado" === isEstado || "isRecibido" === isEstado || isEstado === "isPresupuestado" || isEstado === "isPagado" || isEstado === "isAuth"){

      switch(isEstado){
        case "isFormulado":
          console.log('isFormulado');
          var ordenCompra = await Ordencompra.updateMany({ '_id':{$in:loteId }},{$set:{'isFormulado':true}});
          break;
        case "isRecibido":
          console.log('isRecibido');
          var ordenCompra = await Ordencompra.updateMany({ '_id':{$in:loteId }},{$set:{'isRecibido':true}});
          break;
        case "isPresupuestado":
          console.log('isPresupuestado');
          var ordenCompra = await Ordencompra.updateMany({ '_id':{$in:loteId }},{$set:{'isPresupuestado':true}});
          break;
        case "isPagado":
          console.log('isPagado');
          var ordenCompra = await Ordencompra.updateMany({ '_id':{$in:loteId }},{$set:{'isPagado':true}});
          break;
        case "isAuth":
          console.log('isAuth');
          var ordenCompra = await Ordencompra.updateMany({ '_id':{$in:loteId }},{$set:{'isAuth':true}});
          break;
        default:
          console.log('Error Default Parametro isEstado Inconrrecto');
          res.status(404).send({ message: 'Error Parametro isEstado Inconrrecto' })
      }
      
      if(ordenCompra){
        console.log('isEstado de ordenes de compras actualizado',ordenCompra)
        res.send(ordenCompra);
      }else{
        console.log('Error en actualizacion de isEstado de Ordenes de Compra',   ordenCompra);
        res.status(404).send({ message: 'Error en actualizacion de isEstado de Ordenes de Compra' });
      }
  
  }else{
    console.log('Error : Actualizacion de ordenes de Compra - isEstado incorrecto',   isEstado);
    res.status(404).send({ message: 'Error : Actualizacion de ordenes de Compra - isEstado incorrecto' });
  }
});



router.put("/updateestado", isAuth, async (req, res) => {
  console.log('Orden Compra updateestado', req.body )
  const {_id,estado} = req.body
  const ordenCompra = await Ordencompra.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
  if(ordenCompra){
    ordenCompra.estado = estado;
    const updatedOrdenCompra = await ordenCompra.save();
    if(updatedOrdenCompra){
      console.log('updateestado ordenes de compra',ordenCompra)
      res.send(ordenCompra);
    }else{
      console.log('Error en updateestado Orden de Compra',   ordenCompra);
      res.status(404).send({ message: 'Error en updateestado Orden de Compra' });
    }

  }else{
    console.log('Orden de Compra no encontrado',   ordenCompra);
    res.status(404).send({ message: 'Orden de Compra no encontrado' });
  }
});


router.put("/update", isAuth, async (req, res) => {
  console.log('Orden Compra update', req.body )
  const {_id,fechaAtendido,estado, nombreProveedor,direccionProveedor,proveedorId} = req.body
  const ordenCompra = await Ordencompra.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
  if(ordenCompra){
    ordenCompra.estado = estado || ordenCompra.estado;
    ordenCompra.fechaAtendido = fechaAtendido || ordenCompra.fechaAtendido;
    ordenCompra.nombreProveedor = nombreProveedor || ordenCompra.nombreProveedor;
    ordenCompra.direccionProveedor = direccionProveedor || ordenCompra.direccionProveedor;
    ordenCompra.proveedorId = proveedorId || ordenCompra.proveedorId;
    const updatedOrdenCompra = await ordenCompra.save();
    if(updatedOrdenCompra){
      console.log('updateestado ordenes de compra',ordenCompra)
      res.send({
        _id: updatedOrdenCompra._id,
        ordencompraId: updatedOrdenCompra.ordencompraId,
        nombre: updatedOrdenCompra.nombre,
        proveedorId: updatedOrdenCompra.proveedorId,
        nombreProveedor: updatedOrdenCompra.nombreProveedor,
        direccionProveedor: updatedOrdenCompra.direccionProveedor,
        sucursal: updatedOrdenCompra.sucursal,
        usuario: updatedOrdenCompra.usuario,
        fechaPedido: updatedOrdenCompra.fechaPedido,
        fechaEntrega: updatedOrdenCompra.fechaEntrega,
        fechaAtendido: updatedOrdenCompra.fechaAtendido,
        periodo: updatedOrdenCompra.periodo,
        estado: updatedOrdenCompra.estado,
        isActivo: updatedOrdenCompra.isActivo,
        isRecibido: updatedOrdenCompra.isRecibido,
        isFormulado: updatedOrdenCompra.isFormulado,
        isPagado: updatedOrdenCompra.isPagado,
        isPresupuestado: updatedOrdenCompra.isPresupuestado,
        montoPedido: updatedOrdenCompra.montoPedido,
        descuento: updatedOrdenCompra.descuento,
        gastosEnvio: updatedOrdenCompra.gastosEnvio,
        montoAPagar: updatedOrdenCompra.montoAPagar,
        metodoPago: updatedOrdenCompra.metodoPago,
        detalles: updatedOrdenCompra.detalles,
        unidadesDetalles: updatedOrdenCompra.unidadesDetalles,
        productosDetalles: updatedOrdenCompra.productosDetalles,
      });
    }else{
      console.log('Error en updateestado Orden de Compra',   ordenCompra);
      res.status(404).send({ message: 'Error en updateestado Orden de Compra' });
    }

  }else{
    console.log('Orden de Compra no encontrado',   ordenCompra);
    res.status(404).send({ message: 'Orden de Compra no encontrado' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('Orden de compra registrar req.body ',req.body);
  const {nombre,proveedorId,nombreProveedor,direccionProveedor,sucursal,fechaPedido,horaPedido,fechaEntrega,fechaAtendido,grupoDeCompra,periodo,estado,isActivo,
    montoPedido,descuento,gastosEnvio,montoAPagar,detalles,unidadesDetalles,productosDetalles,metodoPago,isFormulado,usuario} = req.body
  if (nombre && nombreProveedor && grupoDeCompra && sucursal && fechaPedido) {
    const oldOrdenCompra = await Ordencompra.findOne({ nombre: nombre, sucursal: sucursal, nombreProveedor: nombreProveedor,fechaPedido:fechaPedido})
    if (oldOrdenCompra) {
      res.status(400).send({ message: 'Error: Orden de Compra ya existente.' });
    } else {
      const ordencompraId = await getSecuencia("OrdenCompra");
      console.log('ordencompraId',ordencompraId,'detalles',detalles);
      const newOrdencompra = new Ordencompra({
        ordencompraId: ordencompraId,
        nombre: nombre,
        proveedorId: proveedorId,
        nombreProveedor: nombreProveedor,
        direccionProveedor: direccionProveedor,
        sucursal: sucursal,
        fechaPedido: fechaPedido,
        horaPedido: horaPedido,
        fechaEntrega: fechaEntrega,
        fechaAtendido: fechaAtendido,
        grupoDeCompra: grupoDeCompra,
        usuario: usuario,
        periodo: periodo,
        estado: estado,
        isActivo: isActivo,
        isFormulado: isFormulado,
        montoPedido: montoPedido,
        descuento: descuento,
        gastosEnvio: gastosEnvio,
        montoAPagar: montoAPagar,
        metodoPago: metodoPago,
        detalles: detalles,
        unidadesDetalles: unidadesDetalles,
        productosDetalles: productosDetalles,
      });
      const ordencompra = await newOrdencompra.save();
      if (ordencompra) {
        //await addOCPDetalles(ordencompraId,productosDetalles)
        res.send({
          _id: ordencompra._id,
          ordencompraId: ordencompra.ordencompraId,
          nombre: ordencompra.nombre,
          proveedorId: ordencompra.proveedorId,
          nombreProveedor: ordencompra.nombreProveedor,
          direccionProveedor: ordencompra.direccionProveedor,
          sucursal: ordencompra.sucursal,
          fechaPedido: ordencompra.fechaPedido,
          horaPedido: ordencompra.horaPedido,
          fechaEntrega: ordencompra.fechaEntrega,
          fechaAtendido: ordencompra.fechaAtendido,
          grupoDeCompra: ordencompra.grupoDeCompra,
          usuario: ordencompra.usuario,
          periodo: ordencompra.periodo,
          estado: ordencompra.estado,
          isActivo: ordencompra.isActivo,
          isRecibido: ordencompra.isRecibido,
          isFormulado: ordencompra.isFormulado,
          isPagado: ordencompra.isPagado,
          isPresupuestado: ordencompra.isPresupuestado,
          montoPedido: ordencompra.montoPedido,
          descuento: ordencompra.descuento,
          gastosEnvio: ordencompra.gastosEnvio,
          montoAPagar: ordencompra.montoAPagar,
          metodoPago: ordencompra.metodoPago,
          detalles: ordencompra.detalles,
          unidadesDetalles: ordencompra.unidadesDetalles,
          productosDetalles: ordencompra.productosDetalles,
        })
        console.log('creacion de ordencompra',ordencompra);
      } else {
        res.status(404).send({ message: 'Datos de Ordencompra invalidos.' });
      }
    }

  } else {
    res.status(404).send({ message: 'Datos de kardex invalidos.' });
  }
});



module.exports = router;