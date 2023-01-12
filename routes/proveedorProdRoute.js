const express = require('express');
const { getSecuencia } = require('../components/GetSecuencia');
const Proveedorprod = require('../models/proveedorProdModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const proveedorProductos = await Proveedorprod.find({}).sort({ "nombre": -1 }).limit(25);
  if(proveedorProductos){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(proveedorProductos);
    console.log('Proveedores productos',proveedorProductos)
  }else{
    res.status(404).send({ message: 'Proveedores Productos no encontrados' });
    console.log('Proveedores Productos no encontrados',proveedorProductos)
  }
});

// Busca todos los productos que tiene el proveedorId

router.post("/proveedor", isAuth, async (req, res) => {
    console.log('get proveedor productos ', req.body )
    const {proveedorId} = req.body;
    const proveedorProductos = await Proveedorprod.find({proveedorId:proveedorId}).sort({ "productoNombre": -1 }).limit(25);
    if(proveedorProductos){
      //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
      //res.send(users);
      res.send(proveedorProductos);
      console.log('Proveedores productos',proveedorProductos)
    }else{
      res.status(404).send({ message: 'Proveedor Productos no encontrados' });
      console.log('Proveedor Productos no encontrados',proveedorProductos)
    }

  });
  
router.post("/producto", isAuth, async (req, res) => {
  console.log('get proveedor productos proveedor ', req.body )
  const {productoId} = req.body;
  const proveedorsProducto = await Proveedorprod.find({productoId:productoId}).sort({ "proveedorNombre": -1 }).limit(25);
  if(proveedorsProducto){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(proveedorsProducto);
    console.log('Proveedores producto',proveedorsProducto)
  }else{
    res.status(404).send({ message: 'Proveedores Producto no encontrados' });
    console.log('Proveedores Producto no encontrados',proveedorsProducto)
  }

});

router.post('/registrar', async (req, res) => {
  console.log('Proveedor Producto registrar req.body ',req.body);
    const {proveedorId,productoId,productoNombre,proveedorNombre} = req.body;
    if(proveedorId && productoId && productoNombre && proveedorNombre){
        const oldProveedorProducto = await Proveedorprod.findOne({proveedorId:proveedorId,productoId:productoId})

        if(oldProveedorProducto){
          res.status(400).send({ message: 'Error: Proveedor Producto ya existente.' });
          console.log('Proveedor Producto ya existente. ',req.body);
        }else{
          const proveedorProducto = new Proveedorprod({
            proveedorId: proveedorId,
            proveedorNombre: proveedorNombre,
            productoId: productoId,
            productoNombre: productoNombre,
            
          });
          const newProveedorProducto = await proveedorProducto.save();
          if (newProveedorProducto) {
            console.log('newProveedorProducto',newProveedorProducto);
            res.send({
              _id: newProveedorProducto._id,
              proveedorId: newProveedorProducto.proveedorId,
              proveedorNombre: newProveedorProducto.proveedorNombre,
              productoId: newProveedorProducto.productoId,
              productoNombre: newProveedorProducto.productoNombre,
            })
          } else {
            res.status(401).send({ message: 'Datos de Proveedor Producto invalidos.' });
          }
        }
    }else{
        console.log('Falta algun(nos) dato(s)',req.body);
        res.status(400).send({ message: 'Falta algun(nos) dato(s).' });
    }
});


router.delete("/:id", isAuth, async (req, res) => {
  console.log('Proveedor producto delete params',req.params);
  console.log('Proveedor producto delete body',req.body);
  const deletedProveedorProducto = await Proveedorprod.findById(req.params.id);
  if (deletedProveedorProducto) {
    const deletedProducto = await deletedProveedorProducto.remove();
    console.log('deletedProducto',deletedProducto);
    res.send({ 
      _id: deletedProducto._id,
      proveedorId: deletedProducto.proveedorId,
      proveedorNombre: deletedProducto.proveedorNombre,
      productoId: deletedProducto.productoId,
      productoNombre: deletedProducto.productoNombre,
     });
  } else {
    res.send({ message:"Error in Deletion."});
  }
});


module.exports = router;