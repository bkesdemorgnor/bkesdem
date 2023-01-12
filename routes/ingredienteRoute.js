const express = require('express');
const Ingrediente = require('../models/ingredienteModel');
const { getSecuencia } = require('../components/GetSecuencia');
const {addIngredienteKardex} = require('../components/addIngredienteKardex')

const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const ingredientes = await Ingrediente.find({}).sort({ "nombre": -1 }).limit(25);
  if(ingredientes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingredientes);
    //console.log('ingredientes',ingredientes)
  }else{
    res.status(404).send({ message: 'Ingredientes no encontrados' });
    console.log('Ingredientes no encontrados',ingredientes)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {ingrediente} = req.body
  const ingredientes = await Ingrediente.find({ 'nombre': { $regex: ingrediente, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(ingredientes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(ingredientes);
    console.log('ingredientes',ingredientes)
  }else{
    res.status(404).send({ message: 'Ingredientes no encontrados' });
    console.log('Ingredientes no encontrados',    res.send(ingredientes));
    
  }
});

router.post('/registrar', async (req, res) => {
  console.log('Ingrediente registrar req.body ',req.body);
  const {nombre,familia, unidad, descripcion, areas, rendimiento,sucursalTipo,isAutoProcess, grupo  } = req.body
  if(nombre && unidad && descripcion){
    const oldIngrediente = await Ingrediente.findOne({nombre:nombre})
    if(oldIngrediente){
      res.status(400).send({ message: 'Error: Ingrediente ya existe.' });
    }else{
      const ingredienteId = await getSecuencia("Ingrediente");
      console.log('ingredienteId', ingredienteId);
      const ingrediente = new Ingrediente({
        ingredienteId: ingredienteId,
        nombre: nombre,
        familia: familia,
        unidad: unidad,
        descripcion: descripcion,
        areas:areas,
        sucursalTipo:sucursalTipo,
        rendimiento:rendimiento,
        isAutoProcess:isAutoProcess,
        grupo:grupo,
      });
      const newIngrediente = await ingrediente.save();
      if (newIngrediente) {
        console.log('newIngrediente',newIngrediente);
        await addIngredienteKardex(ingredienteId,req.body);
        res.send({
          _id: newIngrediente._id,
          ingredienteId: newIngrediente.ingredienteId,
          nombre: newIngrediente.nombre,
          familia: newIngrediente.familia,
          unidad: newIngrediente.unidad,
          descripcion: newIngrediente.descripcion,
          areas: newIngrediente.areas,
          sucursalTipo: newIngrediente.sucursalTipo,
          rendimiento: newIngrediente.rendimiento,
          isAutoProcess: newIngrediente.isAutoProcess,
          grupo: newIngrediente.grupo,
        })
      } else {
        res.status(400).send({ message: 'Datos de Ingrediente invalidos.' });
        console.log('Datos de Ingrediente invalidos.',req.body);
      }
    }

  }else{
    res.status(400).send({ message: 'Faltan Datos en creacion de Ingrediente.' });
    console.log('Faltan Datos en creacion de Ingrediente.',req.body);
  }
});

module.exports = router;