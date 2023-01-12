const express = require('express');
const Producto = require('../models/productoModel');
const Ingrediente = require('../models/ingredienteModel');
const Unidades = require('../models/unidadesModel');

const { getSecuencia } = require('../components/GetSecuencia');
const { getToken, isAuth } = require( '../util');
const {addAllSucKardex} = require('../components/addAllSucKardex');
const {addUnidades, addIngredientes} = require('../components/addUnidades');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const productos = await Producto.find({}).sort({ "nombre": -1 }).limit(100);
  if(productos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(productos);
    console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',productos)
  }
});

router.post("/buscar", isAuth, async (req, res) => {
  console.log('Producto buscar', req.body )
  const {nombre} = req.body
  const productos = await Producto.find({ 'nombre': { $regex: nombre, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  if(productos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(productos);
    //console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',productos)
  }
});


router.post("/grupo", isAuth, async (req, res) => {
  console.log('get productos grupo', req.body )
  const {grupo} = req.body
  const productos = await Producto.find({ 'grupo': grupo}).sort({ "nombre": -1 }).limit(100);
  if(productos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(productos);
    //console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',productos)
  }
});


router.post("/familia", isAuth, async (req, res) => {
  console.log('get productos familia', req.body )
  const {familia} = req.body
  const productos = await Producto.find({ 'familia': familia}).sort({ "nombre": -1 }).limit(100);
  if(productos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(productos);
    //console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'Productos no encontrados' });
    console.log('Productos no encontrados',productos)
  }
});


router.post("/autounidades", isAuth, async (req, res) => {
  console.log('get Productos autounidades', req.body )
  const {isAutoUnidades} = req.body
  const productos = await Producto.find({ 'isAutoUnidades': isAutoUnidades}).sort({ "nombre": -1 }).limit(100);
  if(productos){
    
    res.send(productos);
    //console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'productos no encontrados' });
    console.log('productos no encontrados',productos)
  }
});

router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  var {nombre,familia,unidad,descripcion,tipo,areas,isMerma,isAutoProcess,isAutoIngre,isPorcionConv,isAutoUnidades,isBien,mermaDesconge,mermaCoccion,mermaLimpieza, grupo, mUnidades,mIngredientes} = req.body
  const v_nombre = nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
  //nombre = nombre.toUpperCase()
  if(nombre && familia && unidad && descripcion && tipo && grupo){
    const oldProducto = await Producto.findOne({nombre:{ $regex: new RegExp(`^${v_nombre}$`), $options: 'i' }})
    if(oldProducto){
      res.status(400).send({ message: 'Error: Producto ya existente.',nombre });
      console.log('Error: Producto ya existente.',nombre);
    }else{
      console.log('Producto NO existente continuamos.',nombre);
      if(mUnidades.asignar){
        // Requiere Unidades
        console.log('Requiere Unidades');
        const oldUnidades = await Unidades.findOne({nombre:{ $regex: new RegExp(`^${mUnidades.nombre}$`), $options: 'i' }})
        if(oldUnidades){
          res.status(400).send({ message: 'Error: Unidades ya existente.' });
          console.log('Error: Unidades ya existente.',mUnidades.nombre);
          return
        }
      }
      const v_descripcion = descripcion.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      const productoId = await getSecuencia("Producto");
      console.log('productoId',productoId);
      const producto = new Producto({
        productoId:productoId,
        nombre: v_nombre,
        familia: familia,
        unidad: unidad,
        descripcion: v_descripcion,
        tipo: tipo,
        areas: areas,
        isMerma: isMerma,
        isAutoProcess: isAutoProcess,
        isAutoUnidades: isAutoUnidades,
        isAutoIngre: isAutoIngre,
        isPorcionConv: isPorcionConv,
        isBien: isBien,
        mermaDesconge: mermaDesconge,
        mermaCoccion: mermaCoccion,
        mermaLimpieza: mermaLimpieza,
        grupo: grupo,
      });
      const newProducto = await producto.save();
      if (newProducto) {
        console.log('newProducto',newProducto);
        //Añadimos Unidades
        console.log('mUnidades.asignar',mUnidades.asignar)
        var unidadesId="";
        if(mUnidades.asignar){
          console.log('mUnidades.asignar',mUnidades.asignar)
          const newUnidades = await addUnidades(productoId,req.body)
          unidadesId = newUnidades.unidadesId
          console.log('unidadesId',unidadesId,newUnidades);
        }
        console.log('mIngredientes.asignar',mIngredientes.asignar)
        var ingredienteId = "";
        if(mIngredientes.asignar){
          console.log('mIngredientes.asignar',mIngredientes.asignar)
          console.log('unidadesId',unidadesId);
          //await addIngredientes(productoId,req.body)
          const newIngrediente = await addIngredientes(unidadesId,req.body)
          ingredienteId=newIngrediente.ingredienteId;
          console.log('ingredienteId',ingredienteId);
        }
        //Añadimos kardex de Producto y Unidades
        await addAllSucKardex(productoId,req.body,unidadesId,ingredienteId);
        res.send({
          _id: newProducto._id,
          productoId: newProducto.productoId,
          nombre: newProducto.nombre,
          familia: newProducto.familia,
          unidad: newProducto.unidad,
          descripcion: newProducto.descripcion,
          areas: newProducto.areas,
          tipo: newProducto.tipo,
          isMerma: newProducto.isMerma,
          isAutoProcess: newProducto.isAutoProcess,
          isAutoUnidades: newProducto.isAutoUnidades,
          isAutoIngre: newProducto.isAutoIngre,
          isPorcionConv: newProducto.isPorcionConv,
          isBien: newProducto.isBien,
          mermaDesconge: newProducto.mermaDesconge,
          mermaCoccion: newProducto.mermaCoccion,
          mermaLimpieza: newProducto.mermaLimpieza,
          grupo: newProducto.grupo
        })
      } else {
        res.status(400).send({ message: 'Datos de Producto invalidos.' });
        console.log('Datos de Producto invalidos.',);  
      }
    }
  }else{
    console.log('Falta parametro(s) de Producto.',);
    res.status(400).send({ message: 'Falta parametro(s) de Producto.' });
  }
});

module.exports = router;