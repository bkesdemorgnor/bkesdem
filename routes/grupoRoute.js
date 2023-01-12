const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Grupo = require('../models/grupoModel');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const grupos = await Grupo.find({}).sort({ "nombre": -1 }).limit(25);
  if(grupos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(grupos);
    //console.log('grupos',grupos)
  }else{
    res.status(404).send({ message: 'Grupos no encontrados' });
    console.log('Grupos no encontrados',grupos)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre, nickname, descripcion} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldGrupo = await Grupo.findOne({nombre:nombre})
        console.log('oldGrupo',oldGrupo);
        if(oldGrupo){
          res.status(400).send({ message: 'Error: Grupo ya existe.' });
        }else{
          //const areaId = await getSecuencia("Almacen");
          //console.log('almacenId',almacenId);
          const grupo = new Grupo({
            nombre: nombre,
            nickname:nickname,
            descripcion: descripcion,
          });
          const newGrupo = await grupo.save();
          if (newGrupo) {
            console.log('newGrupo',newGrupo);
            res.send({
              _id: newGrupo._id,
              nombre: newGrupo.nombre,
              nickname: newGrupo.nickname,
              descripcion: newGrupo.descripcion,
            })
          } else {
            res.status(401).send({ message: 'Datos de Grupo invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Datos de Grupo invalidos.' });
    }
});

module.exports = router;