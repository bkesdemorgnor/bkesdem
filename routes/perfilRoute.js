const express = require('express');
const Perfil = require('../models/perfilModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const perfiles = await Perfil.find({}).sort({ "nombre": -1 }).limit(25);
  if(perfiles){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(perfiles);
    console.log('perfiles',perfiles)
  }else{
    res.status(404).send({ message: 'Perfiles no encontrados' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);

  const oldPerfil = await Perfil.findOne({nombre:req.body.nombre})
  if(oldPerfil){
    res.status(400).send({ message: 'Error: Perfil ya existente.' });
  }else{
    const perfil = new Perfil({
      nombre: req.body.nombre,
      nickname: req.body.nickname,
      descripcion: req.body.descripcion,
    });
    const newPerfil = await perfil.save();
    if (newPerfil) {
      res.send({
        _id: newPerfil._id,
        nombre: newPerfil.nombre,
        nickname: newPerfil.nickname,
        descripcion: newPerfil.descripcion,
      })
    } else {
      res.status(401).send({ message: 'Datos de perfil invalidos.' });
    }
  }
});

module.exports = router;