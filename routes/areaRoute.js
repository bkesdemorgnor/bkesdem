const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Area = require('../models/areaModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const areas = await Area.find({}).sort({ "nombre": -1 }).limit(25);
  if(areas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(areas);
    //console.log('areas',areas)
  }else{
    res.status(404).send({ message: 'Areas no encontradas' });
    console.log('Areas no encontrados',areas)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre, nickname, descripcion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldArea = await Area.findOne({nombre:nombre})
        console.log('oldArea',oldArea);
        if(oldArea){
          res.status(400).send({ message: 'Error: Area ya existe.' });
        }else{
          //const areaId = await getSecuencia("Almacen");
          //console.log('almacenId',almacenId);
          const area = new Area({
            nombre: nombre,
            nickname:nickname,
            descripcion: descripcion,
            isProduccion: isProduccion,
          });
          const newArea = await area.save();
          if (newArea) {
            console.log('newArea',newArea);
            res.send({
              _id: newArea._id,
              nombre: newArea.nombre,
              nickname: newArea.nickname,
              descripcion: newArea.descripcion,
              isProduccion: newArea.isProduccion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Area invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Area invalidos.' });
    }
});

module.exports = router;