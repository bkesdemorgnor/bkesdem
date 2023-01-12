const express = require('express');
const Sucursal = require('../models/sucursalModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const Sucursales = await Sucursal.find({}).sort({ "orden": 1 }).limit(25);
  if(Sucursales){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(Sucursales);
    //console.log('Sucursales',Sucursales)
  }else{
    res.status(404).send({ message: 'Sucursales no encontrados' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldSucursal = await Sucursal.findOne({nombre:req.body.nombre})
  if(oldSucursal){
    res.status(400).send({ message: 'Error: Sucursal ya existente.' });
  }else{
    const sucursal = new Sucursal({
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      nickname: req.body.nickname,
      descripcion: req.body.descripcion,
      orden: req.body.orden,
    });
    const newSucursal = await sucursal.save();
    if (newSucursal) {
      console.log('newSucursal',newSucursal);
      res.send({
        _id: newSucursal._id,
        nombre: newSucursal.nombre,
        tipo: newSucursal.tipo,
        nickname: newSucursal.nickname,
        descripcion: newSucursal.descripcion,
        orden: newSucursal.orden,
        isActive: newSucursal.isActive,
      })
    } else {
      res.status(401).send({ message: 'Datos de Sucursal invalidos.' });
    }
  }
});

module.exports = router;