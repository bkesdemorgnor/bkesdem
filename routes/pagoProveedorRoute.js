const express = require('express');
const Pagoproveedor = require('../models/pagoProveedorModel');
const { getSecuencia } = require('../components/GetSecuencia');
//const Ordencompradet = require('../models/cuentadetModel');
//const {addOCPDetalles} = require('../components/addOCPDetalles');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const pagoproveedores = await Pagoproveedor.find({}).sort({ "updatedAt": -1 }).limit(200);
  if(pagoproveedores){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pagoproveedores);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Cuentas de compra no encontrados' });
  }
});


router.post("/sucursal", isAuth, async (req, res) => {
  console.log('Pago de Proveedor get sucursal body', req.body)
  const {sucursal} = req.body;
  
  const pagoproveedores = await Pagoproveedor.find({sucursal:sucursal}).sort({ "updatedAt": -1 }).limit(200);
  if(pagoproveedores){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(pagoproveedores);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'Pago de Proveedor no encontrados' });
  }
});

router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {ordenCompra,sucursal} = req.body
  const pagoproveedores = await Pagoproveedor.find({ 'sucursal':sucursal,'nombre': { $regex: ordenCompra, $options : "i"} }).sort({ "updatedAt": -1 }).limit(100);
  if(pagoproveedores){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    console.log('Buscar pagoproveedores',pagoproveedores)
    res.send(pagoproveedores);
  }else{
    console.log('Buscar pagoproveedores de compra no encontrados',pagoproveedores);
    res.status(404).send({ message: 'pagoproveedores de compra no encontrados' });
    
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  console.log('get pagoproveedores de compra grupo', req.body )
  const {sucursal,grupoDeCompra} = req.body
  const pagoproveedores = await Pagoproveedor.find({ 'sucursal':sucursal,'grupoDeCompra': grupoDeCompra }).sort({ "updatedAt": -1 }).limit(100);
  if(pagoproveedores){
    console.log('Grupo pagoproveedores de compra',pagoproveedores)
    res.send(pagoproveedores);
  }else{
    console.log('Grupo Kardexs no encontrados',   pagoproveedores);
    res.status(404).send({ message: 'Grupo de pagoproveedores de compra no encontrados' });
  }
});

// Obtener las pagoproveedores con el estado que solicitan ... en funcion
router.post("/estado", isAuth, async (req, res) => {
  console.log('get PagoProveedores con estado req.body', req.body )
  const {estado} = req.body
  const pagoproveedores = await Pagoproveedor.find({ 'estado':estado}).sort({ "updatedAt": -1 }).limit(100);
  if(pagoproveedores){
    console.log('PagoProveedores con el estado',estado,pagoproveedores)
    res.send(pagoproveedores);
  }else{
    console.log('PagoProveedores no encontrados',   pagoproveedores);
    res.status(404).send({ message: 'PagoProveedores no encontrados' });
  }
});


router.put("/updateestado", isAuth, async (req, res) => {
  console.log('Orden Compra updateestado', req.body )
  const {_id,estado} = req.body
  const ordenCompra = await Pagoproveedor.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
  if(ordenCompra){
    ordenCompra.estado = estado;
    const updatedOrdenCompra = await ordenCompra.save();
    if(updatedOrdenCompra){
      console.log('updateestado pagoproveedores de compra',ordenCompra)
      res.send(ordenCompra);
    }else{
      console.log('Error en updateestado Pago de Proveedor',   ordenCompra);
      res.status(404).send({ message: 'Error en updateestado Pago de Proveedor' });
    }

  }else{
    console.log('Pago de Proveedor no encontrado',   ordenCompra);
    res.status(404).send({ message: 'Pago de Proveedor no encontrado' });
  }
});



router.post('/registrar', async (req, res) => {
  console.log('Pago de Proveedor registrar req.body ',req.body);
  const {nombre,usuario,estado,fecha,montoTotal,montoPagado,saldoPendiente,proveedorId,proveedorNombre,tipoFinanciacion,operaciones,ordenesCompra} = req.body
  if (nombre && usuario && estado && fecha && montoTotal) {
    const oldPagoProveedor = await Pagoproveedor.findOne({ nombre: nombre, fecha: fecha, proveedorId: proveedorId})
    if (oldPagoProveedor) {
      res.status(400).send({ message: 'Error: Pagoproveedor existente.' });
    } else {
      const pagoProveedorId = await getSecuencia("PagoProveedor");
      console.log('pagoProveedorId',pagoProveedorId);
      const newOrdencompra = new Pagoproveedor({
        pagoProveedorId: pagoProveedorId,
        nombre: nombre,
        proveedorId: proveedorId,
        proveedorNombre: proveedorNombre,
        usuario: usuario,
        estado: estado,
        fecha: fecha,
        montoTotal: montoTotal,
        montoPagado: montoPagado,
        saldoPendiente: saldoPendiente,
        tipoFinanciacion: tipoFinanciacion,
        operaciones: operaciones,
        ordenesCompra: ordenesCompra,
      });
      const pagoproveedor = await newOrdencompra.save();
      if (pagoproveedor) {
        //await addOCPDetalles(pagoProveedorId,productosDetalles)
        res.send({
            _id:pagoproveedor._id,
            pagoProveedorId:pagoproveedor.pagoProveedorId,
            nombre:pagoproveedor.nombre,
            proveedorId:pagoproveedor.proveedorId,
            proveedorNombre:pagoproveedor.proveedorNombre,
            usuario:pagoproveedor.usuario,
            estado:pagoproveedor.estado,
            fecha:pagoproveedor.fecha,
            montoTotal:pagoproveedor.montoTotal,
            montoPagado:pagoproveedor.montoPagado,
            saldoPendiente:pagoproveedor.saldoPendiente,
            tipoFinanciacion:pagoproveedor.tipoFinanciacion,
            operaciones:pagoproveedor.operaciones,
            ordenesCompra:pagoproveedor.ordenesCompra,
        })
        console.log('creacion de pagoproveedor',pagoproveedor);
      } else {
        res.status(404).send({ message: 'Datos de Pagoproveedor invalidos.' });
      }
    }

  } else {
    res.status(404).send({ message: 'Faltan Datos para registro de Pagoproveedor.' });
  }
});


router.put('/regsaldo', async (req, res) => {
    console.log('Pago de Proveedor registrar saldo req.body ',req.body);
    const {_id,estado,montoPagado,saldoPendiente,operaciones} = req.body
    if ( estado && montoPagado && operaciones) {
        const pagoProveedor = await Pagoproveedor.findOne({ '_id':_id }).sort({ "updatedAt": -1 }).limit(1);
        if(pagoProveedor){
            pagoProveedor.estado = estado || pagoProveedor.estado;
            pagoProveedor.operaciones = operaciones || pagoProveedor.operaciones;
            pagoProveedor.montoPagado = montoPagado || pagoProveedor.montoPagado;
            pagoProveedor.saldoPendiente = saldoPendiente || pagoProveedor.saldoPendiente;
            const updatedPagoProveedor = await pagoProveedor.save();
            if(updatedPagoProveedor){
                console.log('updatedPagoProveedor',updatedPagoProveedor)
                res.send({
                    _id:updatedPagoProveedor._id,
                    pagoProveedorId:updatedPagoProveedor.pagoProveedorId,
                    nombre:updatedPagoProveedor.nombre,
                    proveedorId:updatedPagoProveedor.proveedorId,
                    proveedorNombre:updatedPagoProveedor.proveedorNombre,
                    usuario:updatedPagoProveedor.usuario,
                    estado:updatedPagoProveedor.estado,
                    fecha:updatedPagoProveedor.fecha,
                    montoTotal:updatedPagoProveedor.montoTotal,
                    montoPagado:updatedPagoProveedor.montoPagado,
                    saldoPendiente:updatedPagoProveedor.saldoPendiente,
                    tipoFinanciacion:updatedPagoProveedor.tipoFinanciacion,
                    operaciones:updatedPagoProveedor.operaciones,
                    ordenesCompra:updatedPagoProveedor.ordenesCompra,
                })
            }else{
                console.log('Error en updatedPagoProveedor', updatedPagoProveedor);
                res.status(404).send({ message: 'Error en updatedPagoProveedor'});
            }
        } else {
            console.log('Pagoproveedor no encontrado', pagoProveedor);
            res.status(404).send({ message: 'Pagoproveedor no encontrado' });
        }
    } else {
        console.log('Faltan Datos para registro de Pagoproveedor', montoTotal);
        res.status(404).send({ message: 'Faltan Datos para registro de Pagoproveedor.' });
  }
});
  
  

module.exports = router;