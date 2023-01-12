const express = require('express');
const Productotipo = require('../models/productoTipoModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get productoTipo', req )
  const tipos = await Productotipo.find({}).sort({ "nombre": -1 }).limit(25);
  if(tipos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(tipos);
    //console.log('producto tipos',tipos)
  }else{
    res.status(404).send({ message: 'Tipos de productos no encontradas' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldProductotipo = await Productotipo.findOne({nombre:req.body.nombre})
  if(oldProductotipo){
    res.status(400).send({ message: 'Error: Tipo de producto ya existente.' });
  }else{
    const productotipo = new Productotipo({
      nombre: req.body.nombre,
      nickname: req.body.nickname,
      descripcion: req.body.descripcion,
    });
    const newProductoTipo = await productotipo.save();
    if (newProductoTipo) {
      console.log('newProductoTipo',newProductoTipo);
      res.send({
        _id: newProductoTipo._id,
        nombre: newProductoTipo.nombre,
        nickname: newProductoTipo.nickname,
        descripcion: newProductoTipo.descripcion,
      })
    } else {
      res.status(401).send({ message: 'Datos de tipo de producto invalidos.' });
    }
  }
});

module.exports = router;