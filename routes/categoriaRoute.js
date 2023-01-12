const express = require('express');
const Categoria = require('../models/categoriaModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const categorias = await Categoria.find({}).sort({ "nombre": -1 }).limit(100);
  if(categorias){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(categorias);
    //console.log('categorias',categorias)
  }else{
    res.status(404).send({ message: 'categorias no encontradas' });
    console.log('categorias no encontradas',categorias)
  }
});

router.get("/:id", isAuth, async (req, res) => {
  console.log('get cartas Id', req.params )
  const {id} = req.params;
  const categoria = await Categoria.find({}).sort({ "nombre": -1 }).limit(100);
  if(categoria){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(categoria);
    console.log('carta',categoria)
  }else{
    res.status(404).send({ message: 'categoria no encontrada' });
    console.log('categoria no encontrada',categoria)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {categoria} = req.body
  const categorias = await Categoria.find({ 'nombre': { $regex: categoria, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(categorias){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(categorias);
    //console.log('categorias',categorias)
  }else{
    res.status(404).send({ message: 'categorias no encontrados' });
    console.log('categorias no encontradas', categorias );
    
  }
});


router.post('/registrar', async (req, res) => {
  var {nombre,area,sucursalTipo,estado,isSys,isActivo} = req.body;
  console.log('registrar categoria :',req.body);
  const oldCategoria = await Categoria.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
  if(oldCategoria){
    console.log('Error: Categoria ya existe.',oldCategoria);
    res.status(400).send({ message: 'Error: Categoria ya existe.' });
  }else{
    const categoriaId = await getSecuencia("Categorias");
    const v_categoria = new Categoria({
      categoriaId:categoriaId,
      nombre: nombre,
      area: area,
      sucursalTipo: sucursalTipo,
      isSys: isSys,
      isActivo: isActivo,
      estado: estado,
    });
    const newCategoria = await v_categoria.save();
    console.log('newCategoria',newCategoria);
    res.send({
      _id:newCategoria._id,
      categoriaId:newCategoria.categoriaId,
      nombre:newCategoria.nombre,
      area:newCategoria.area,
      sucursalTipo:newCategoria.sucursalTipo,
      isSys:newCategoria.isSys,
      isActivo:newCategoria.isActivo,
      estado:newCategoria.estado,
    })
  }
});


router.put('/actualizar', async (req, res) => {
  var {categoriaId,nombre, area,sucursalTipo,isSys,isActivo,estado} = req.body;
  console.log('actualizar categoria :',req.body);
  const oldCategoria = await Categoria.findOne({categoriaId:categoriaId})
  if(oldCategoria){
    console.log('oldCategoria',oldCategoria.categoriaId);
    
    oldCategoria.categoriaId = categoriaId || oldCategoria.categoriaId;
    oldCategoria.nombre = nombre || oldCategoria.nombre;
    oldCategoria.area = area || oldCategoria.area;
    oldCategoria.sucursalTipo = sucursalTipo || oldCategoria.sucursalTipo;
    oldCategoria.isSys = isSys || oldCategoria.isSys;
    oldCategoria.isActivo = isActivo || oldCategoria.isActivo;
    oldCategoria.estado = estado || oldCategoria.estado;
   
    const updatedCategoria = await oldCategoria.save();
    console.log('updatedCategoria',updatedCategoria);
    res.send({
      _id:updatedCategoria._id,
      categoriaId:updatedCategoria.categoriaId,
      nombre:updatedCategoria.nombre,
      area:updatedCategoria.area,
      sucursalTipo:updatedCategoria.sucursalTipo,
      isSys:updatedCategoria.isSys,
      isActivo:updatedCategoria.isActivo,
      estado:updatedCategoria.estado,
    })
  }else{
    res.status(400).send({ message: 'Error de Actualizacion: Categoria NO existe.' });
    console.log('Error de Actualizacion: Categoria NO existe.',oldCategoria);
  }
});


module.exports = router;