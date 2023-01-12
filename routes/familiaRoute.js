const express = require('express');
const Familia = require('../models/familiaModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get familias', req )
  const familias = await Familia.find({}).sort({ "nombre": -1 }).limit(25);
  if(familias){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(familias);
    //console.log('familias',familias)
  }else{
    console.log('Familias no encontradas');
    res.status(404).send({ message: 'Familias no encontradas' });
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  console.log('get familias de compra grupo', req.body )
  const {grupoDeCompra} = req.body
  const familias = await Familia.find({ 'grupoDeCompras':grupoDeCompra }).sort({ "updatedAt": -1 }).limit(100);
  if(familias){
    console.log('Familias de Grupo de compra',familias)
    res.send(familias);
  }else{
    console.log('Familias Grupo de compras no encontrados',   familias);
    res.status(404).send({ message: 'Familias de Grupo de compra no encontrados' });
  }
});

router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldFamilia = await Familia.findOne({nombre:req.body.nombre})
  if(oldFamilia){
    res.status(400).send({ message: 'Error: Familia ya existente.' });
  }else{
    const familia = new Familia({
      nombre: req.body.nombre,
      lugarCompra: req.body.lugarCompra,
      descripcion: req.body.descripcion,
    });
    const newFamilia = await familia.save();
    if (newFamilia) {
      console.log('newFamilia',newFamilia);
      res.send({
        _id: newFamilia._id,
        nombre: newFamilia.nombre,
        lugarCompra: newFamilia.lugarCompra,
        descripcion: newFamilia.descripcion,
      })
    } else {
      res.status(401).send({ message: 'Datos de Familia invalidos.' });
    }
  }
});

module.exports = router;