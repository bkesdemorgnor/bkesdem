const express = require('express');
const Receta = require('../models/recetaModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const recetas = await Receta.find({}).sort({ "nombre": -1 }).limit(100);
  if(recetas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(recetas);
    //console.log('recetas',recetas)
  }else{
    res.status(404).send({ message: 'Recetas no encontradas' });
    console.log('Recetas no encontradas',recetas)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get porcion Id', req.params )
  const {id} = req.params;
  const receta = await Receta.find({}).sort({ "nombre": -1 }).limit(100);
  if(receta){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(receta);
    console.log('receta',receta)
  }else{
    res.status(404).send({ message: 'Receta no encontrada' });
    console.log('Receta no encontrada',receta)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {receta} = req.body
  const recetas = await Receta.find({ 'nombre': { $regex: receta, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(recetas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(recetas);
    console.log('recetas',recetas)
  }else{
    res.status(404).send({ message: 'recetas no encontrados' });
    console.log('recetas no encontradas', recetas );
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre, descripcion} = req.body;
  console.log('registrar nombre :',nombre);
  const oldReceta = await Receta.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldReceta){
    res.status(400).send({ message: 'Error: Receta ya existe.' });
  }else{
    const recetaId = await getSecuencia("Recetas");
    console.log('recetaId',recetaId);
    const receta = new Receta({
        recetaId:recetaId,
        nombre: nombre,
        descripcion: descripcion,
    });
    const newReceta = await receta.save();
    if (newReceta) {
      
      console.log('newReceta',newReceta);
      
      res.send({newReceta})
    } else {
      res.status(401).send({ message: 'Datos de Receta invalidos.' });
    }
  }
});

module.exports = router;