const express = require('express');
const Venta = require('../models/ventaModel');
const { getToken, isAuth } = require( '../util');
const { addVenta } = require( '../components/addVenta');
const { addRegVenta } = require( '../components/addRegVenta');
const { response } = require('express');
const {egresoKardex} = require('../components/egresoKardex');
const {egresoRegKardex} = require('../components/egresoRegKardex');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const kardexes = await Kardex.find({}).sort({ "nombre": -1 }).limit(25);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexes);
    console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
  }
});


router.post("/regventas", isAuth, async (req, res) => {
    console.log('ventas regventas body', req.body)
    const {sucursal, fecha,ventas} = req.body;
   
    if (ventas) {
        
        const response1 =await addVenta(0,sucursal,fecha,ventas[0])
        console.log('response1',response1);
        
        if(response1 === undefined){
          console.log('Error respuesta incorrecta:',response1);
          res.status(404).send({ message: 'Error Venta ya registrada' });
        }else{
          console.log('ventas.length',ventas.length);
          for(let i = 1;i < ventas.length;i++){
            console.log('upVentas :',i,sucursal,fecha,ventas[i].PRODUCTO);
            const newVenta =await addVenta(i,sucursal,fecha,ventas[i])
            console.log('ventaRoute newVenta',newVenta.producto);
            const response =await egresoKardex(i,sucursal,fecha,ventas[i],newVenta)
            //console.log('response',response);
          }
          res.send({response1})
          console.log('Registro Correcto de Ventas',response1 );
        }
    
    }else{
        console.log('Error parametro ventas no encontrada:',ventas);
        res.status(404).send({ message: 'Parametro Ventas no encontrados' });
    }
  
});


router.post("/regloteventas", isAuth, async (req, res) => {
  console.log('ventas regventas body', req.body)
  const {ventas} = req.body;
 
  if (ventas) {
      
        var qtyErrores = 0
        var qtyVentas = ventas.length

        console.log('ventas.length',qtyVentas);
        for(let i = 0;i < ventas.length;i++){
          console.log('upVentas :',i,ventas[i].sucursal,ventas[i].fecha,ventas[i].producto);
          const newVenta =await addRegVenta(ventas[i])
          console.log('ventaRoute newVenta',newVenta);
          if(newVenta === undefined){
            console.log('newVenta',newVenta);
            qtyErrores = qtyErrores+1
          }else{
            const response =await egresoRegKardex(ventas[i],newVenta)
          }
          //console.log('response',response);
        }
        //res.send({response1})
        const v_resultado = {qtyVentas:qtyVentas,qtyErrores:qtyErrores}
        //res.status(200).send('Exitoso Registro');
        console.log('Registro Correcto de Ventas', v_resultado);
        res.send({
          v_resultado
        })
  
  }else{
      console.log('Error parametro ventas no encontrada:',ventas);
      res.status(404).send({ message: 'Parametro Ventas no encontrados' });
  }

});


router.post('/registrar', async (req, res) => {
  console.log('Kardex registrar req.body ',req.body);
  const {kardextipo,nombre,sucursal,sucursalTipo,area,almacenId,unidadId} = req.body
  if (nombre && sucursal && area) {
    const oldkardex = await Kardex.findOne({ nombre: nombre, sucursal: sucursal, area: area })
    if (oldkardex) {
      res.status(400).send({ message: 'Error: kardex ya existente.' });
    } else {
      const kardexId = await getSecuencia("Kardex");
      //console.log('kardexId',kardexId);
      const kardex = new Kardex({
        kardexId: kardexId,
        kardextipo: kardextipo,
        nombre: nombre,
        sucursal: sucursal,
        sucursalTipo: sucursalTipo,
        area: area,
        almacenId: almacenId,
        unidadId: unidadId,
      });
      const newKardex = await kardex.save();
      if (newKardex) {
        res.send({
          newKardex
        })
      } else {
        res.status(401).send({ message: 'Datos de kardex invalidos.' });
      }
    }

  } else {
    res.status(401).send({ message: 'Datos de kardex invalidos.' });
  }
});


router.post('/regconsumo', async (req, res) => {
  console.log('Kardex registrar req.body ',req.body);
  const {kardexId,isAutoProcess,manualLunes,manualMartes,manualMiercoles,manualJueves,manualViernes,
    manualSabado,manualDomingo,manualSemana} = req.body
  if (kardexId ) {
    const oldkardex = await Kardex.findOne({ kardexId: kardexId})
    if (oldkardex) {
      oldkardex.isAutoProcess=isAutoProcess
      oldkardex.manualLunes=manualLunes
      oldkardex.manualMartes=manualMartes
      oldkardex.manualMiercoles=manualMiercoles
      oldkardex.manualJueves=manualJueves
      oldkardex.manualViernes=manualViernes
      oldkardex.manualSabado=manualSabado
      oldkardex.manualDomingo=manualDomingo
      oldkardex.manualSemana=manualSemana
     
      const updatedKardex = await oldkardex.save();
      res.send(updatedKardex)
      //console.log('updatedKardex',updatedKardex)
    } else {
      
        res.status(401).send({ message: 'KardexId No existe.' });
    }
  }
});


router.post('/regporcion', async (req, res) => {
  console.log('Kardex registrar req.body ',req.body);
  const {kardextipo,nombre,sucursal,sucursalTipo,area,almacenId,unidadId} = req.body
  if(kardextipo === 'Porcion'){

    if (nombre && sucursal && area) {
      const oldkardex = await Kardex.findOne({ nombre: nombre, sucursal: sucursal, area: area })
      if (oldkardex) {
        res.status(400).send({ message: 'Error: kardex ya existente.' });
      } else {
        const kardexId = await getSecuencia("Kardex");
        console.log('kardexId',kardexId);
        const kardex = new Kardex({
          kardexId: kardexId,
          kardextipo: kardextipo,
          nombre: nombre,
          sucursal: sucursal,
          sucursalTipo: sucursalTipo,
          area: area,
          almacenId: almacenId,
          unidadId: unidadId,
        });
        const newKardex = await kardex.save();
        if (newKardex) {
          res.send({
            newKardex
          })
        } else {
          res.status(401).send({ message: 'Datos de kardex invalidos.' });
        }
      }
  
    } else {
      res.status(401).send({ message: 'Datos de kardex invalidos.' });
    }
  }
});


module.exports = router;