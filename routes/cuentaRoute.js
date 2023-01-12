const express = require('express');
const Cuenta = require('../models/cuentaModel');
const { getSecuencia } = require('../components/GetSecuencia');
//const Ordencompradet = require('../models/cuentadetModel');
const {addOCPDetalles} = require('../components/addOCPDetalles');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const cuentas = await Cuenta.find({}).sort({ "updatedAt": -1 }).limit(200);
  if(cuentas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cuentas);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Cuentas de compra no encontrados' });
  }
});


router.post("/sucursal", isAuth, async (req, res) => {
  console.log('Orden de Compra get sucursal body', req.body)
  const {sucursal} = req.body;
  
  const cuentas = await Cuenta.find({sucursal:sucursal}).sort({ "updatedAt": -1 }).limit(200);
  if(cuentas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cuentas);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Orden de Compra no encontrados' });
  }
});

router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {ordenCompra,sucursal} = req.body
  const cuentas = await Cuenta.find({ 'sucursal':sucursal,'nombre': { $regex: ordenCompra, $options : "i"} }).sort({ "updatedAt": -1 }).limit(100);
  if(cuentas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    console.log('Buscar cuentas',cuentas)
    res.send(cuentas);
  }else{
    console.log('Buscar cuentas de compra no encontrados',cuentas);
    res.status(404).send({ message: 'cuentas de compra no encontrados' });
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  console.log('get cuentas de compra grupo', req.body )
  const {sucursal,grupoDeCompra} = req.body
  const cuentas = await Cuenta.find({ 'sucursal':sucursal,'grupoDeCompra': grupoDeCompra }).sort({ "updatedAt": -1 }).limit(100);
  if(cuentas){
    console.log('Grupo cuentas de compra',cuentas)
    res.send(cuentas);
  }else{
    console.log('Grupo Kardexs no encontrados',   cuentas);
    res.status(404).send({ message: 'Grupo de cuentas de compra no encontrados' });
  }
});

// Obtener las cuentas con el estado que solicitan ... en funcion
router.post("/estado", isAuth, async (req, res) => {
  console.log('get Cuentas con estado req.body', req.body )
  const {estado} = req.body
  const cuentas = await Cuenta.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
  if(cuentas){
    console.log('Cuentas con el estado',estado,cuentas)
    res.send(cuentas);
  }else{
    console.log('Cuentas no encontrados',   cuentas);
    res.status(404).send({ message: 'Cuentas no encontrados' });
  }
});


router.put("/updateestado", isAuth, async (req, res) => {
  console.log('Orden Compra updateestado', req.body )
  const {_id,estado} = req.body
  const ordenCompra = await Cuenta.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
  if(ordenCompra){
    ordenCompra.estado = estado;
    const updatedOrdenCompra = await ordenCompra.save();
    if(updatedOrdenCompra){
      console.log('updateestado cuentas de compra',ordenCompra)
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



router.post('/registrar', async (req, res) => {
  console.log('Orden de compra registrar req.body ',req.body);
  const {nombre,usuario,estado,fechaAsignacion,montoPresupuesto,montoPedido,montoAsignado,tipoOperacion,fechaOperacion,nroOperacion,ordenesCompra} = req.body
  if (nombre && usuario && estado && fechaAsignacion && montoAsignado) {
    const oldCuenta = await Cuenta.findOne({ nombre: nombre, fechaAsignacion: fechaAsignacion, usuario: usuario})
    if (oldCuenta) {
      res.status(400).send({ message: 'Error: Cuenta existente.' });
    } else {
      const cuentaId = await getSecuencia("Cuenta");
      console.log('cuentaId',cuentaId);
      const newOrdencompra = new Cuenta({
        cuentaId: cuentaId,
        nombre: nombre,
        usuario: usuario,
        estado: estado,
        fechaAsignacion: fechaAsignacion,
        montoPresupuesto: montoPedido,
        montoAsignado: montoAsignado,
        tipoOperacion: tipoOperacion,
        fechaOperacion: fechaOperacion,
        nroOperacion: nroOperacion,
        ordenesCompra: ordenesCompra,
      });
      const cuenta = await newOrdencompra.save();
      if (cuenta) {
        //await addOCPDetalles(cuentaId,productosDetalles)
        res.send({
            _id:cuenta._id,
            cuentaId:cuenta.cuentaId,
            nombre:cuenta.nombre,
            usuario:cuenta.usuario,
            estado:cuenta.estado,
            fechaAsignacion:cuenta.fechaAsignacion,
            montoPresupuesto:cuenta.montoPresupuesto,
            montoAsignado:cuenta.montoAsignado,
            tipoOperacion:cuenta.tipoOperacion,
            fechaOperacion:cuenta.fechaOperacion,
            nroOperacion:cuenta.nroOperacion,
            ordenesCompra:cuenta.ordenesCompra,
        })
        console.log('creacion de cuenta',cuenta);
      } else {
        res.status(404).send({ message: 'Datos de Cuenta invalidos.' });
      }
    }

  } else {
    res.status(404).send({ message: 'Faltan Datos para registro de Cuenta.' });
  }
});



module.exports = router;