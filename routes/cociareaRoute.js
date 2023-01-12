const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Cociarea = require('../models/cociareaModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const cociareas = await Cociarea.find({}).sort({ "nombre": -1 }).limit(25);
  if(cociareas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(cociareas);
    //console.log('areas',areas)
  }else{
    res.status(404).send({ message: 'Cocina areas no encontradas' });
    console.log('Cocina areas no encontrados',cociareas)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre, nickname, descripcion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldCociArea = await Cociarea.findOne({nombre:nombre})
        console.log('oldCociArea',oldCociArea);
        if(oldCociArea){
          res.status(400).send({ message: 'Error: Area de Cocina ya existe.' });
        }else{
          
          const cociarea = new Cociarea({
            nombre: nombre,
            nickname:nickname,
            descripcion: descripcion,
          });
          const newCociArea = await cociarea.save();
          if (newCociArea) {
            console.log('newCociArea',newCociArea);
            res.send({
              _id: newCociArea._id,
              nombre: newCociArea.nombre,
              nickname: newCociArea.nickname,
              descripcion: newCociArea.descripcion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Area de Cocina invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Area de Cocina invalidos.' });
    }
});

module.exports = router;