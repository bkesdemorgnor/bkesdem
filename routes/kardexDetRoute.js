const express = require('express');
const Kardexdet = require('../models/kardexDetModel');
const Kardex = require('../models/kardexModel');
const { getToken, isAuth } = require( '../util');
const { getSecuencia } = require('../components/GetSecuencia');
const { outKardexDetalle, outAperturaKardexDetalle } = require('../components/outKardexDetalle');
const { inKardexDetalle, inAperturaKardexDetalle } = require('../components/inKardexDetalle');
const {regSalidaKardex, regLoteSalidaKardex} = require('../components/regSalidaKardex');
const { regLoteIngresoKardex} = require('../components/regIngresoKardex');


const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const kardexes = await Kardex.find({}).sort({ "createdAt": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexes);
    console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
  }
});


router.post("/sucursal", isAuth, async (req, res) => {
  console.log('kardex get sucursal params', req.params)
  console.log('kardex get sucursal body', req.body)
  const {sucursal, area} = req.body;
  
  const kardexes = await Kardex.find({sucursal:sucursal,area:area}).sort({ "nombre": -1 }).limit(25);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexes);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
  }
});


router.post("/kardexid", isAuth, async (req, res) => {
  console.log('kardexDet get kardexid body', req.body)
  const {kardexId} = req.body;
  
  const kardexdets = await Kardexdet.find({kardexId:kardexId}).sort({$natural:-1}).limit(200);
  if(kardexdets){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexdets);
    //console.log('kardexdets',kardexdets)
  }else{
    res.status(404).send({ message: 'kardex detalles no encontrados' });
    console.log('kardex detalles no encontrados', req.body)
  }
});


router.post("/consumosemana", isAuth, async (req, res) => {
  console.log('kardexDet get consumosemana body', req.body)
  const {nombreId, sucursal} = req.body;

  const kardexdets = await Kardex.findOne({nombreId:nombreId,sucursal:sucursal})

  console.log('kardexdets',kardexdets);
  const kardexId =kardexdets.kardexId;
  console.log('kardexdets.kardexId',kardexId);
  var fecha = new Date().toISOString().slice(0,10);
  console.log('fecha',fecha);
  
  fecha = '2022-09-01'
  var d = new Date(); // today!
  var x = 7; // go back 5 days!
  d.setDate(d.getDate() - x);
  var fechaIni = d.toISOString().slice(0,10);
  console.log('d',d);
  console.log('fechaIni',fechaIni);

  
  const kardexdetalles = await Kardexdet.aggregate([
    // First Stage
    
    {
      $match : { "fecha": { $gte: new Date(fechaIni)},"kardexId":kardexId }
      //$match : { "fecha": { $in : ["2022-08-01", "2022-09-01"] },"kardexId":kardexId }
      //$match : { "kardexId":kardexId }
    },
    // Second Stage
    {
      $group : {
         _id : { fecha: "$fecha" },
         totalSalidaCantidad: { $sum: "$salidaCantidad" },
         count: { $sum: 1 }
      }
    },
    // Third Stage
    {
      $sort : { totalSalidaCantidad: -1 }
    }
   ])
  
   console.log('kardexdetalles',kardexdetalles);
   console.log('kardexdetalles-length',kardexdetalles.length);
   if(kardexdetalles.length !== 0){
    const kardexDets = kardexdetalles.map((k,i)=>({_id:k._id.fecha,cantidad:k.totalSalidaCantidad,count:k.count}))
    console.log('kardexDets',kardexDets);
    //console.log('kardexdetalles 0:',kardexdetalles[0]._id.fecha);
    res.json(kardexDets);
    console.log('kardexDets',kardexDets)

   }else{
    res.status(404).send({ message: 'kardex detalles no encontrados' });
    console.log('kardex detalles no encontrados',kardexdetalles)
   }

  /* const kardexdets = await Kardexdet.find({kardexId:kardexId}).sort({$natural:-1}).limit(25);
  if(kardexdets){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexdets);
    console.log('kardexdets',kardexdets)
  }else{
    res.status(404).send({ message: 'kardex detalles no encontrados' });
  } */
});


router.post('/ingresalida', async (req, res) => {
  console.log('KardexDet ingreso req.body ',req.body);
  const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = req.body
  if (kardexId && fecha && descripcion) {
    const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    if (oldkardexDet) {
      const v_saldoCantidad = oldkardexDet.saldoCantidad
      const v_saldoPrecio = oldkardexDet.saldoPrecio
      const v_saldoTotal = oldkardexDet.saldoTotal
      console.log('oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
      if(isIngreso){
        // Es ingreso de Kardex detallado
        console.log('oldkardexDet Es ingreso:',oldkardexDet);
        var v_newSaldoTotal = v_saldoTotal + Total
        var v_newSaldoCantidad = v_saldoCantidad + Cantidad
        var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
        console.log('newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
        var kardexDet = new Kardexdet({
          kardexId: kardexId,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: descripcion,
          ingresoCantidad: Cantidad,
          ingresoPrecio: Precio,
          ingresoTotal: Total,
          saldoCantidad: v_newSaldoCantidad,
          saldoPrecio: v_newSaldoPrecio,
          saldoTotal: v_newSaldoTotal,
        });

      }else{
        // Es salida de Kardex detallado
        console.log('oldkardexDet es salida:',oldkardexDet);
        var v_newSaldoTotal = v_saldoTotal - Total
        var v_newSaldoCantidad = v_saldoCantidad - Cantidad
        if(v_newSaldoCantidad === 0){
          v_newSaldoPrecio = v_saldoPrecio
        }else{

          var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
        }
        var v_newSalidaTotal = Cantidad * v_saldoPrecio
        console.log('newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
        var kardexDet = new Kardexdet({
          kardexId: kardexId,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: descripcion,
          salidaCantidad: Cantidad,
          salidaPrecio: v_saldoPrecio,
          salidaTotal: v_newSalidaTotal,
          saldoCantidad: v_newSaldoCantidad,
          saldoPrecio: v_newSaldoPrecio,
          saldoTotal: v_newSaldoTotal,
        });
      }
    } else {
      // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro

      if(isIngreso){
        // Es primer registro de Ingreso
        var kardexDet = new Kardexdet({
          kardexId: kardexId,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: descripcion,
          ingresoCantidad: Cantidad,
          ingresoPrecio: Precio,
          ingresoTotal: Total,
          saldoCantidad: Cantidad,
          saldoPrecio: Precio,
          saldoTotal: Total,
        });
        
      }else{
        // Es primer registro de Salida, salida sin ingreso, es negativo
        var kardexDet = new Kardexdet({
          kardexId: kardexId,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: descripcion,
          salidaCantidad: Cantidad,
          salidaPrecio: Precio,
          salidaTotal: Total,
          saldoCantidad: -Cantidad,
          saldoPrecio: Precio,
          saldoTotal: -Total,
        });

      }
      
    }
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
      res.send(newKardexDet)
      console.log('newKardexDet',newKardexDet);
    } else {
      res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
    }

  } else {
    res.status(401).send({ message: 'Datos de kardex invalidos.' });
  }
});


router.post('/ingreso', async (req, res) => {
  console.log('KardexDet ingreso req.body ',req.body);
  const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = req.body
  if (kardexId && fecha && descripcion) {
    const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('ingreso kardexDetId',kardexDetId);
    if (oldkardexDet) {
      var newKardexDet = await inKardexDetalle(oldkardexDet[0],req.body,kardexDetId)
      console.log('ingreso newKardexDet',newKardexDet);
    } else {
      // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
      // Es primer registro de Ingreso
      var newKardexDet = await inAperturaKardexDetalle(req.body,kardexDetId)
      console.log('Apertura newKardexDet',newKardexDet);
      
    }
    if (newKardexDet) {
      res.send(newKardexDet)
      console.log('ingreso newKardexDet',newKardexDet);
    } else {
      res.status(404).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
    }
  } else {
    res.status(404).send({ message: 'Datos de kardex invalidos.' });
  }
});



router.post('/salida', async (req, res) => {
  console.log('KardexDet salida req.body ',req.body);
  const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = req.body
  if (kardexId && fecha && descripcion) {
    const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('salida kardexDetId',kardexDetId,oldkardexDet);
    if (oldkardexDet) {

      var newKardexDet = await outKardexDetalle(oldkardexDet[0],req.body,kardexDetId)
      console.log('salida newKardexDet',newKardexDet);
    }else{
      // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
      // Es primer registro de Salida, salida sin ingreso, es negativo
      var newKardexDet = await outAperturaKardexDetalle(req.body,kardexDetId)
      console.log('salida Apertura newKardexDet',newKardexDet);
    }
    
    if (newKardexDet) {
      res.send(newKardexDet)
      console.log('salida newKardexDet',newKardexDet);
    } else {
      console.log('Error No se pudo grabar',newKardexDet);
      res.status(404).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
    }
  } else {
    console.log('Error Datos de ingreso invalidos');
    res.status(404).send({ message: 'Datos de kardex invalidos.' });
  }
});


router.post("/reglotesalida", isAuth, async (req, res) => {
  console.log('KardexDet registro de lote de salida body', req.body)
  const {loteSalida} = req.body;
 
  const v_resultado = await regLoteSalidaKardex(loteSalida)
  if(v_resultado){
    console.log('Registro Correcto de RegSalida', v_resultado);
    res.send({
      v_resultado
    }) 

  }else{
    console.log('Error parametro reglotesalida no encontrada:',v_resultado);
    res.status(404).send({ message: 'Parametro reglotesalida no encontrados' });
  }

 /*  if  (loteSalida)  {
      
        var qtyErrores = 0
        var qtyMontoTotal = 0
        var qtyRegSalida = loteSalida.length

        console.log('loteSalida.length',qtyRegSalida);
        await loteSalida.forEach(async (ls)=>{
          console.log('ls',ls);
          const newRegSalida = await regSalidaKardex(ls);
          if(newRegSalida){
            console.log('newRegSalida exitoso:',newRegSalida);
            const v_salidaTotal = newRegSalida.salidaTotal
            qtyMontoTotal = qtyMontoTotal + parseFloat(v_salidaTotal)
            console.log('v_salidaTotal',v_salidaTotal,"qtyMontoTotal",qtyMontoTotal);
          }else{
            console.log('newRegSalida',newRegSalida);
            qtyErrores = qtyErrores+1
          }
        })
        
        //res.send({response1})
        var v_resultado = { qtyRegSalida: qtyRegSalida, qtyErrores: qtyErrores, qtyMontoTotal: qtyMontoTotal }
        //res.status(200).send('Exitoso Registro');
        console.log('Registro Correcto de RegSalida', v_resultado);
        res.send({
          v_resultado
        }) */
  
  /* }else{
      console.log('Error parametro ventas no encontrada:',ventas);
      res.status(404).send({ message: 'Parametro Ventas no encontrados' });
  } */

});


router.post("/regloteingreso", isAuth, async (req, res) => {
  console.log('KardexDet registro de lote de ingreso body', req.body)
  const {loteIngreso} = req.body;
  console.log('loteIngreso',loteIngreso);
 
  const v_resultado = await regLoteIngresoKardex(loteIngreso);
  if(v_resultado){
    console.log('Registro exitoso de RegIngreso:',v_resultado);
    res.send(v_resultado)
  }else{
    console.log('Error parametro ventas no encontrada:',ventas);
    res.status(404).send({ message: 'Parametro regLoteIngreso no encontrados' });
  }
      
});


router.post('/apertura', async (req, res) => {
  console.log('KardexDet apertura req.body ',req.body);
  const {kardexId,fecha,descripcion,Cantidad,Precio,Total} = req.body
  if (kardexId && fecha && descripcion && Cantidad && Precio ) {
    const oldkardex = await Kardexdet.findOne({ kardexId: kardexId, fecha: fecha, descripcion: descripcion })
    if (oldkardex) {
      console.log('Ya existe kardex de apertura',oldkardex);
      res.status(400).send({ message: 'Error: kardex de Apertura ya existe.' });
    } else {
      const kardexDetId = await getSecuencia("Kardexdetalle");
      console.log('kardexDetId',kardexDetId);
      const kardexDet = new Kardexdet({
        kardexDetId: kardexDetId,
        kardexId: kardexId,
        fecha: fecha,
        descripcion: descripcion,
        isIngreso: true,
        ingresoCantidad: Cantidad,
        ingresoPrecio: Precio,
        ingresoTotal: Total,
        saldoCantidad: Cantidad,
        saldoPrecio: Precio,
        saldoTotal: Total,
      });
      const newKardexDet = await kardexDet.save();
      if (newKardexDet) {
        const upKardex = await updatePromPorcionAuto(kardexId,Cantidad,Precio)
        //console.log('upKardex',upKardex);
        res.send({
          _id:newKardexDet._id,
          kardexDetId:newKardexDet.kardexDetId,
          kardexId:newKardexDet.kardexId,
          fecha:newKardexDet.fecha,
          descripcion:newKardexDet.descripcion,
          isIngreso:newKardexDet.isIngreso,
          ingresoCantidad:newKardexDet.ingresoCantidad,
          ingresoPrecio:newKardexDet.ingresoPrecio,
          ingresoTotal:newKardexDet.ingresoTotal,
          saldoCantidad:newKardexDet.saldoCantidad,
          saldoPrecio:newKardexDet.saldoPrecio,
          saldoTotal:newKardexDet.saldoTotal,
          salidaCantidad:newKardexDet.salidaCantidad,
          salidaPrecio:newKardexDet.salidaPrecio,
          salidaTotal:newKardexDet.salidaTotal,
        })
      } else {
        res.status(404).send({ message: 'Datos de kardex Detalle invalidos.' });
        console.log('Error no grabo el kardex',v_kardexsFiltrado);
      }
    }

  } else {
    res.status(404).send({ message: 'Datos de kardex detalles invalidos.' });
    console.log('Error, algun dato no esta correcto',kardexId ,fecha, descripcion, Cantidad,Precio, Total);
  }
});

const updatePromPorcionAuto = async (kardexId,stock,precio) =>{
  console.log('updatePromPorcionAuto kardexId:',kardexId,stock,precio);
  if (kardexId ) {
    const oldkardex = await Kardex.findOne({ kardexId: kardexId})
    if (oldkardex) {
      if(oldkardex.isAutoProcess){
        oldkardex.promSemana=stock
        oldkardex.promLunes=stock * 0.1
        oldkardex.promMartes=stock * 0.1
        oldkardex.promMiercoles=stock * 0.1
        oldkardex.promJueves=stock * 0.13
        oldkardex.promViernes=stock * 0.17
        oldkardex.promSabado=stock * 0.2
        oldkardex.promDomingo=stock * 0.2
      }else{
        oldkardex.promSemana=0
        oldkardex.promLunes=0
        oldkardex.promMartes=0
        oldkardex.promMiercoles=0
        oldkardex.promJueves=0
        oldkardex.promViernes=0
        oldkardex.promSabado=0
        oldkardex.promDomingo=0
      }
      
      oldkardex.stock=stock
      oldkardex.ultimoPrecio=precio
      oldkardex.precioPromedio=precio
      oldkardex.isApertura=true
     
      const updatedKardex = await oldkardex.save();
      //console.log('updatedKardex',updatedKardex)
      return updatedKardex
    } else {
      console.log('Error KardexId no se pudo actualizar.',kardexId);
      return updatedKardex
    }
  }else{
    console.log('Error KardexId no se encontro.:',kardexId);
    return null
  }
}
module.exports = router;