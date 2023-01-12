const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Almacen = require('../models/almacenModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const almacenes = await Almacen.find({}).sort({ "nombre": -1 }).limit(25);
  if(almacenes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(almacenes);
    console.log('almacenes',almacenes)
  }else{
    res.status(404).send({ message: 'Almacenes no encontrados' });
    console.log('Almacenes no encontrados',almacenes)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre, local, direccion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldAlmacen = await Almacen.findOne({nombre:nombre})
        console.log('oldAlmacen',oldAlmacen);
        if(oldAlmacen){
          res.status(400).send({ message: 'Error: Almacen ya existe.' });
        }else{
          const almacenId = await getSecuencia("Almacen");
          console.log('almacenId',almacenId);
          const almacen = new Almacen({
            almacenId: almacenId,
            nombre: nombre,
            local:local,
            direccion: direccion,
          });
          const newAlmacen = await almacen.save();
          if (newAlmacen) {
            console.log('newAlmacen',newAlmacen);
            res.send({
              _id: newAlmacen._id,
              almacenId: newAlmacen.almacenId,
              nombre: newAlmacen.nombre,
              local: newAlmacen.local,
              direccion: newAlmacen.direccion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Almacen invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Almacen invalidos.' });
    }
});

module.exports = router;