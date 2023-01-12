const express = require('express');
const Sucursaltipo = require('../models/sucursalTipoModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get sucursalTipos',Sucursaltipo)
  const sucursalTipos = await Sucursaltipo.find({}).sort({ "nombre": -1 }).limit(25);
  if(sucursalTipos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(sucursalTipos);
    //console.log('sucursalTipos',sucursalTipos)
  }else{
    res.status(404).send({ message: 'Tipos de Sucursales no encontrados' });
  }
});


module.exports = router;