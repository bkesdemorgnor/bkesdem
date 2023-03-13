const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Ingresogasto = require('../models/ingresoGastoModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get ingresoGasto', req.body )
  const ingresoGastos = await Ingresogasto.find({}).sort({ "createdAt": -1 }).limit(25);
  if(ingresoGastos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastos);
    console.log('ingresoGasto',ingresoGastos)
  }else{
    res.status(404).send({ message: 'Ingreso Gastos no encontrados' });
    console.log('Ingreso Gastos no encontrados',ingresoGastos)
  }
});

router.get("/ingresos", isAuth, async (req, res) => {
  console.log('get ingresoGasto ingresos', req.body )
  const ingresoGastos = await Ingresogasto.find({isEgreso:false}).sort({ "createdAt": -1 }).limit(25);
  if(ingresoGastos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastos);
    console.log('ingresoGasto',ingresoGastos)
  }else{
    res.status(404).send({ message: 'Ingreso Gastos no encontrados' });
    console.log('Ingreso Gastos no encontrados',ingresoGastos)
  }
});

/* funcion que retorna un resumen de los INGRESOS de la tabla ingresoGasto
  Parametros de entrada:
  fecha_de -> fecha de inicio del Rango de fechas
  fecha_a  -> fecha de fin del rango de fechas
*/
router.post("/resuingresos", isAuth, async (req, res) => {
  console.log('get ingresoGasto resumen ingresos', req.body )
  const {fecha_de, fecha_a} = req.body;
    
  const ingresoGastos = await Ingresogasto.aggregate([

    // First Stage
    {
      $match : { fecha:{$gte:fecha_de,$lte:fecha_a},isEgreso:false }
    },
    {
      $group : { _id: {proveedorAcreedor:"$proveedorAcreedor",isProveedor:"$isProveedor",tipoIngresoGasto:"$tipoIngresoGasto"}, montoEgreso:{$sum:'$montoEgreso'}, montoIngreso:{$sum:'$montoIngreso'} }
    },
    
  ])
  console.log('resumen ingresoGastos',ingresoGastos);
  if(ingresoGastos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastos);
    console.log('ingresoGasto',ingresoGastos)
  }else{
    res.status(404).send({ message: 'Ingreso Gastos no encontrados' });
    console.log('Ingreso Gastos no encontrados',ingresoGastos)
  }
});

/* funcion que retorna un resumen de los EGRESOS con tipoFinanciacion = "Credito" de la tabla ingresoGasto
  Parametros de entrada:
  fecha_de -> fecha de inicio del Rango de fechas
  fecha_a  -> fecha de fin del rango de fechas
*/
router.post("/resuegresoscredito", isAuth, async (req, res) => {
  console.log('get ingresoGasto resumen egresos credito', req.body )
  const {fecha_de, fecha_a} = req.body;
    
  const ingresoGastos = await Ingresogasto.aggregate([

    // First Stage
    {
      $match : { fecha:{$gte:fecha_de,$lte:fecha_a}, tipoFinanciacion:"Credito",isEgreso:true }
    },
    {
      $group : { _id: {proveedorAcreedor:"$proveedorAcreedor",isProveedor:"$isProveedor",tipoIngresoGasto:"$tipoIngresoGasto"}, montoEgreso:{$sum:'$montoEgreso'}, montoIngreso:{$sum:'$montoIngreso'} }
    },
    
  ])
  console.log('resumen ingresoGastos',ingresoGastos);
  if(ingresoGastos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastos);
    console.log('ingresoGasto',ingresoGastos)
  }else{
    res.status(404).send({ message: 'Ingreso Gastos no encontrados' });
    console.log('Ingreso Gastos no encontrados',ingresoGastos)
  }
});

/* funcion que retorna un resumen de los EGRESOS con tipoFinanciacion = "Contado" de la tabla ingresoGasto
  Parametros de entrada:
  fecha_de -> fecha de inicio del Rango de fechas
  fecha_a  -> fecha de fin del rango de fechas
*/
router.post("/resuegresoscontado", isAuth, async (req, res) => {
  console.log('get ingresoGasto resumen egresos contado', req.body )
  const {fecha_de, fecha_a} = req.body;
    
  const ingresoGastos = await Ingresogasto.aggregate([

    // First Stage
    {
      $match : { fecha:{$gte:fecha_de,$lte:fecha_a}, tipoFinanciacion:"Contado",isEgreso:true }
    },
    {
      $group : { _id: {proveedorAcreedor:"$proveedorAcreedor",isProveedor:"$isProveedor",tipoIngresoGasto:"$tipoIngresoGasto"}, montoEgreso:{$sum:'$montoEgreso'}, montoIngreso:{$sum:'$montoIngreso'} }
    },
    
  ])
  console.log('resumen ingresoGastos',ingresoGastos);
  if(ingresoGastos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastos);
    console.log('ingresoGasto',ingresoGastos)
  }else{
    res.status(404).send({ message: 'Ingreso Gastos no encontrados' });
    console.log('Ingreso Gastos no encontrados',ingresoGastos)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar ingresoGasto req.body ',req.body);
    const {detalle, isEgreso,isBien,isProveedor,proveedorAcreedor,tipoFinanciacion,tipoIngresoGasto, metodoOperacion,nroOperacion,estado, montoIngreso,montoEgreso,fecha} = req.body;
    if(detalle){
        console.log('ingresoGasto Llego detalle',detalle);
        const oldIngresoGastoTipo = await Ingresogasto.findOne({detalle:detalle,proveedorAcreedor:proveedorAcreedor,fecha:fecha,isEgreso:isEgreso,nroOperacion:nroOperacion})
        console.log('oldIngresoGastoTipo',oldIngresoGastoTipo);
        if(oldIngresoGastoTipo){
          res.status(400).send({ message: 'Error: Ingreso Gasto Tipo ya existe.' });
        }else{
            const ultimoIngresoGasto = await Ingresogasto.find({}).find().sort({$natural:-1}).limit(1);
            console.log('ultimoIngresoGasto',ultimoIngresoGasto);
            var ultimoSaldo = 0
            if(Object.entries(ultimoIngresoGasto).length !== 0){
                ultimoSaldo = parseFloat(ultimoIngresoGasto[0].saldo)
            }
            console.log('ultimoSaldo',ultimoSaldo);
            const ingresoGastoId = await getSecuencia("IngresoGasto");
            if(isEgreso){
              /* Esto es en caso que sea Egreso */
              var v_nuevoSaldo = ultimoSaldo - parseFloat(montoEgreso)
            }else{
              /* Esto es en caso que sea Ingreso */
              var v_nuevoSaldo = ultimoSaldo + parseFloat(montoIngreso)
            }
            console.log('ingresoGastoId',ingresoGastoId);
            const ingresoGasto = new Ingresogasto({
                ingresoGastoId: ingresoGastoId,
                isEgreso: isEgreso,
                isBien: isBien,
                isProveedor: isProveedor,
                detalle: detalle,
                proveedorAcreedor:proveedorAcreedor,
                tipoIngresoGasto:tipoIngresoGasto,
                tipoFinanciacion:tipoFinanciacion,
                metodoOperacion:metodoOperacion,
                nroOperacion:nroOperacion,
                fecha:fecha,
                montoIngreso:montoIngreso,
                montoEgreso:montoEgreso,
                saldo:v_nuevoSaldo,
            });
            const newIngresoGastoTipo = await ingresoGasto.save();
            if (newIngresoGastoTipo) {
                console.log('newIngresoGastoTipo',newIngresoGastoTipo);
                res.send({
                    _id: newIngresoGastoTipo._id,
                    ingresoGastoId: newIngresoGastoTipo.ingresoGastoId,
                    isEgreso: newIngresoGastoTipo.isEgreso,
                    isBien: newIngresoGastoTipo.isBien,
                    isProveedor: newIngresoGastoTipo.isProveedor,
                    detalle: newIngresoGastoTipo.detalle,
                    proveedorAcreedor: newIngresoGastoTipo.proveedorAcreedor,
                    tipoIngresoGasto: newIngresoGastoTipo.tipoIngresoGasto,
                    tipoFinanciacion: newIngresoGastoTipo.tipoFinanciacion,
                    metodoOperacion: newIngresoGastoTipo.metodoOperacion,
                    nroOperacion: newIngresoGastoTipo.nroOperacion,
                    fecha: newIngresoGastoTipo.fecha,
                    montoIngreso: newIngresoGastoTipo.montoIngreso,
                    montoEgreso: newIngresoGastoTipo.montoEgreso,
                    saldo: newIngresoGastoTipo.saldo,
                })
            } else {
                res.status(401).send({ message: 'Datos de Ingreso Gasto invalidos.' });
            }
        }
    }else{
        console.log('No Llego detalle',detalle);
        res.status(404).send({ message: 'Datos de Ingreso Gasto invalidos.' });
    }
});
            

module.exports = router;