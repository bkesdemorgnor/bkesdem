const express = require('express');
//const { getSecuencia } = require('../components/GetSecuencia');
const Tipooperacion = require('../models/tipoOperacionModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const tiposOperacion = await Tipooperacion.find({}).sort({ "nombre": -1 }).limit(25);
  if(tiposOperacion){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(tiposOperacion);
    console.log('tiposOperacion',tiposOperacion)
  }else{
    res.status(404).send({ message: 'Grupos no encontrados' });
    console.log('Grupos no encontrados',tiposOperacion)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('TipoOperacion registrar req.body ',req.body);
    const {nombre, nickname, descripcion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldTipoOperacion = await Tipooperacion.findOne({nombre:nombre})
        console.log('oldTipoOperacion',oldTipoOperacion);
        if(oldTipoOperacion){
          res.status(400).send({ message: 'Error: Tipooperacion ya existe.' });
        }else{
          //const areaId = await getSecuencia("Almacen");
          //console.log('almacenId',almacenId);
          const tipoOperacion = new Tipooperacion({
            nombre: nombre,
            nickname:nickname,
            descripcion: descripcion,
          });
          const newTipoOperacion = await tipoOperacion.save();
          if (newTipoOperacion) {
            console.log('newTipoOperacion',newTipoOperacion);
            res.send({
              _id: newTipoOperacion._id,
              nombre: newTipoOperacion.nombre,
              nickname: newTipoOperacion.nickname,
              descripcion: newTipoOperacion.descripcion,
            })
          } else {
            res.status(404).send({ message: 'Error al registrar en BD.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(404).send({ message: 'Datos de Tipooperacion invalidos.' });
    }
});

module.exports = router;