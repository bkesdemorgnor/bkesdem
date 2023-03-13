const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Ingresogastotipo = require('../models/ingresoGastoTipoModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get ingresoGastoTipo', req.body )
  const ingresoGastoTipos = await Ingresogastotipo.find({}).sort({ "nombre": -1 }).limit(25);
  if(ingresoGastoTipos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingresoGastoTipos);
    //console.log('ingresoGastoTipos',ingresoGastoTipos)
  }else{
    res.status(404).send({ message: 'Ingreso Gasto tipos no encontrados' });
    console.log('Ingreso Gasto tipos no encontrados',ingresoGastoTipos)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar ingresoGastoTipo req.body ',req.body);
    const {nombre, nickname, isEgreso} = req.body;
    if(nombre){
        console.log('ingresoGastoTipo Llego nombre',nombre);
        const oldIngresoGastoTipo = await Ingresogastotipo.findOne({nombre:nombre})
        console.log('oldIngresoGastoTipo',oldIngresoGastoTipo);
        if(oldIngresoGastoTipo){
          res.status(400).send({ message: 'Error: Ingreso Gasto Tipo ya existe.' });
        }else{
          const ingresoGastoTipoId = await getSecuencia("IngresoGastoTipo");
          console.log('ingresoGastoTipoId',ingresoGastoTipoId);
          const ingresoGastoTipo = new Ingresogastotipo({
            ingresoGastoTipoId: ingresoGastoTipoId,
            nombre: nombre,
            nickname:nickname,
            isEgreso: isEgreso,
          });
          const newIngresoGastoTipo = await ingresoGastoTipo.save();
          if (newIngresoGastoTipo) {
            console.log('newIngresoGastoTipo',newIngresoGastoTipo);
            res.send({
              _id: newIngresoGastoTipo._id,
              ingresoGastoTipoId: newIngresoGastoTipo.ingresoGastoTipoId,
              nombre: newIngresoGastoTipo.nombre,
              nickname: newIngresoGastoTipo.nickname,
              descripcion: newIngresoGastoTipo.descripcion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Ingreso Gasto Tipo invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Kardex tipo invalidos.' });
    }
});

module.exports = router;