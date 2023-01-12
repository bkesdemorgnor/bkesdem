const express = require('express');
const Formula = require('../models/formulaModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');
const {addPorcionKardex} = require('../components/addPorcionKardex')

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const formulas = await Formula.find({}).sort({ "nombre": -1 }).limit(100);
  if(formulas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formulas);
    //console.log('formulas',formulas)
  }else{
    res.status(404).send({ message: 'Formulas no encontrados' });
    console.log('Formulas no encontrados',formulas)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get formula Id', req.params )
  const {id} = req.params;
  const formulas = await Formula.find({}).sort({ "nombre": -1 }).limit(100);
  if(formulas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formulas);
    //console.log('formulas',formulas)
  }else{
    res.status(404).send({ message: 'Formulas no encontrados' });
    console.log('Formulas no encontrados',formulas)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {formula} = req.body
  const formulas = await Formula.find({ 'nombre': { $regex: formula, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(formulas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formulas);
    //console.log('formulas',formulas)
  }else{
    res.status(404).send({ message: 'Formulas no encontrados' });
    console.log('Formulas no encontrados',    res.send(formulas));
    
  }
});


router.post("/familia", isAuth, async (req, res) => {
  console.log('get formula req.body', req.body )
  const {familia} = req.body
  const formulas = await Formula.find({familia:familia}).sort({ "nombre": -1 }).limit(100);
  if(formulas){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(formulas);
    //console.log('formulas',formulas)
  }else{
    res.status(404).send({ message: 'Formulas no encontrados' });
    console.log('Formulas no encontrados',formulas)
  }
});

router.post('/registrar', async (req, res) => {
  console.log('formula registrar req.body',req.body);
  var {nombre, unidad, descripcion, area, rendimiento,cantidad,isAutoProcess } = req.body;
  //nombre = nombre.toUpperCase()
  console.log('formula registrar :',nombre, unidad, descripcion, area, rendimiento,isAutoProcess);
  const oldFormula = await Formula.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldFormula){
    res.status(400).send({ message: 'Error: Formula ya existe.' });
  }else{
    const formulaId = await getSecuencia("Formula");
    console.log('formulaId',formulaId);
    const formula = new Formula({
        formulaId:formulaId,
        nombre: nombre,
        unidad: unidad,
        cantidad: cantidad,
        area:area,
        descripcion:descripcion,
        rendimiento:rendimiento,
        isAutoProcess:isAutoProcess,
  
    });
    const newFormula = await formula.save();
    if (newFormula) {
      
      console.log('newFormula',newFormula);
      //await addPorcionKardex(porcionId,req.body);

      res.send({
        _id: newFormula._id,
        formulaId: newFormula.formulaId,
        nombre: newFormula.nombre,
        unidad: newFormula.unidad,
        cantidad: newFormula.cantidad,
        area: newFormula.area,
        descripcion: newFormula.descripcion,
        rendimiento: newFormula.rendimiento,
        isAutoProcess: newFormula.isAutoProcess,
      })
    } else {
      res.status(401).send({ message: 'Datos de Formula invalidos.' });
    }
  }
});

module.exports = router;