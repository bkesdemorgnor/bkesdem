const express = require('express');
//const { getSecuencia } = require('../components/GetSecuencia');
const Kardextipo = require('../models/kardexTipoModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get kardexTipo', req.body )
  const kardexTipos = await Kardextipo.find({}).sort({ "nombre": -1 }).limit(25);
  if(kardexTipos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexTipos);
    //console.log('kardexTipos',kardexTipos)
  }else{
    res.status(404).send({ message: 'Kardex tipos no encontrados' });
    console.log('Kardex tipos no encontrados',kardexTipos)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre, nickname, descripcion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldKardexTipo = await Kardextipo.findOne({nombre:nombre})
        console.log('oldKardexTipo',oldKardexTipo);
        if(oldKardexTipo){
          res.status(400).send({ message: 'Error: Kardex Tipo ya existe.' });
        }else{
          //const areaId = await getSecuencia("Almacen");
          //console.log('almacenId',almacenId);
          const kardexTipo = new Kardextipo({
            nombre: nombre,
            nickname:nickname,
            descripcion: descripcion,
          });
          const newKardexTipo = await kardexTipo.save();
          if (newKardexTipo) {
            console.log('newKardexTipo',newKardexTipo);
            res.send({
              _id: newKardexTipo._id,
              nombre: newKardexTipo.nombre,
              nickname: newKardexTipo.nickname,
              descripcion: newKardexTipo.descripcion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Kardex Tipo invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Kardex tipo invalidos.' });
    }
});

module.exports = router;