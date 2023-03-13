const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Proveedor = require('../models/proveedorModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const proveedores = await Proveedor.find({}).sort({ "nombre": -1 }).limit(25);
  if(proveedores){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(proveedores);
    //console.log('proveedores',proveedores)
  }else{
    res.status(404).send({ message: 'Proveedores no encontrados' });
    console.log('proveedores no encontrados',proveedores)
  }
});


router.get("/proveedor/:proveedorId", isAuth, async (req, res) => {
  console.log('get proveedor by Id', req.params )
  const {proveedorId} = req.params
  const proveedor = await Proveedor.findOne({proveedorId:proveedorId});
  if(proveedor){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(proveedor);
    //console.log('proveedores',proveedores)
  }else{
    res.status(404).send({ message: 'Proveedor no encontrado' });
    console.log('proveedor no encontrado',proveedor)
  }
});


router.post("/buscar", isAuth, async (req, res) => {
  console.log('Proveedor buscar', req.body )
  const {proveedor} = req.body
  //const proveedores = await Proveedor.find({ 'nombre': { $regex: proveedor, $options : "i"} }).sort({ "nombre": -1 }).limit(100);
  const proveedores = await Proveedor.find({$or:[{ 'nombre': { $regex: proveedor, $options : "i"} },{ 'contacto': { $regex: proveedor, $options : "i"} }]}).sort({ "nombre": 1 }).limit(100);
  if(proveedores){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(proveedores);
    //console.log('productos',productos)
  }else{
    res.status(404).send({ message: 'Proveedor no encontrado' });
    console.log('Proveedor no encontrado',proveedores)
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
    const {nombre,cecomercial,ruc,direccion,telefono,contacto,nroctabank,email} = req.body;
    if(nombre){
        console.log('Llego nombre',nombre);
        const oldProveedor = await Proveedor.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
        console.log('oldProveedor',oldProveedor);
        if(oldProveedor){
          res.status(400).send({ message: 'Error: Proveedor ya existente.' });
        }else{
          const proveedorId = await getSecuencia("Proveedor");
          console.log('proveedorId',proveedorId);
          const proveedor = new Proveedor({
            proveedorId: proveedorId,
            nombre: nombre,
            cecomercial: cecomercial,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            contacto: contacto,
            nroctabank: nroctabank,
            email: email
          });
          const newProveedor = await proveedor.save();
          if (newProveedor) {
            console.log('newProveedor',newProveedor);
            res.send({
              _id: newProveedor._id,
              nombre: newProveedor.nombre,
              cecomercial: newProveedor.cecomercial,
              ruc: newProveedor.ruc,
              direccion: newProveedor.direccion,
              telefono: newProveedor.telefono,
              contacto: newProveedor.contacto,
              nroctabank: newProveedor.nroctabank,
              email: newProveedor.email,
            })
          } else {
            res.status(401).send({ message: 'Datos de Proveedor invalidos.' });
          }
        }
    }else{
        console.log('No Llego nombre',nombre);
        res.status(401).send({ message: 'Faltan Datos de Proveedor.' });
    }
});


// Adicionar familia a registro de proveedor 
router.put('/addfamilia', async (req, res) => {
  console.log('proveedor adicionar familia req.body ',req.body);
    const {proveedorId,familia} = req.body;
    if(proveedorId && familia){
        console.log('Llego familia',familia);
        const oldProveedor = await Proveedor.findOne({proveedorId:proveedorId,familias:{$nin:[familia]}},{nombre:1,familias:1})
        console.log('oldProveedor',oldProveedor);
        if(oldProveedor){
          console.log('Proveedor Existe',oldProveedor);
          oldProveedor.familias= [...oldProveedor.familias,familia]
          
          const newProveedor = await oldProveedor.save();
          if (newProveedor) {
            console.log('newProveedor',newProveedor);
            res.send({
              _id: newProveedor._id,
              nombre: newProveedor.nombre,
              cecomercial: newProveedor.cecomercial,
              ruc: newProveedor.ruc,
              direccion: newProveedor.direccion,
              telefono: newProveedor.telefono,
              contacto: newProveedor.contacto,
              nroctabank: newProveedor.nroctabank,
              email: newProveedor.email,
              familias:newProveedor.familias
            })
          } else {
            res.status(404).send({ message: 'Datos de Proveedor invalidos.' });
          }
        }else{
          res.status(400).send({ message: 'Error: Proveedor NO existe o Familia ya inscrito.' });
        }
    }else{
        console.log('No Llego familia',familia);
        res.status(404).send({ message: 'Faltan Datos de Proveedor.' });
    }
});



// buscar todos los proveedores que tengan una familia presente en su campo de familias 
router.post('/familia', async (req, res) => {
  console.log('proveedor buscar familia req.body ',req.body);
    const {familia} = req.body;
    if(familia){
        console.log('Llego familia',familia);
        const proveedores = await Proveedor.find({familias:familia})
        //console.log('proveedores',proveedores);
        if(proveedores.length>0){
          //console.log('proveedores Existe',proveedores);
         
            res.send(proveedores)
          } else {
            console.log('proveedores NO Existe',proveedores);
            res.status(404).send({ message: 'No hay Proveedores en esta familia.' });
          }
        
    }else{
        console.log('No Llego familia',familia);
        res.status(404).send({ message: 'Faltan Datos de Proveedor.' });
    }
});


// buscar todos los proveedores que tengan una familia presente en su campo de familias 
router.post('/familias', async (req, res) => {
  console.log('proveedores que tengan las familias req.body ',req.body);
    const {familias} = req.body;
    if(familias){
        //console.log('Llego familia',familia);
        const proveedores = await Proveedor.find({familias:{$in:familias}})
        //console.log('proveedores',proveedores);
        if(proveedores.length>0){
          //console.log('proveedores Existe',proveedores);
         
            res.send(proveedores)
          } else {
            console.log('proveedores NO Existe',proveedores);
            res.status(404).send({ message: 'No hay Proveedores en estas familias.' });
          }
        
    }else{
        console.log('No Llego familias',familias);
        res.status(404).send({ message: 'No llegaron Datos de familias.' });
    }
});

module.exports = router;