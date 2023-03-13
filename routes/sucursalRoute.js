const express = require('express');
const Sucursal = require('../models/sucursalModel');
const Kardex = require('../models/kardexModel');
const { getSecuencia } = require('../components/GetSecuencia');


const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const Sucursales = await Sucursal.find({}).sort({ "orden": 1 }).limit(25);
  if(Sucursales){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(Sucursales);
    //console.log('Sucursales',Sucursales)
  }else{
    res.status(404).send({ message: 'Sucursales no encontrados' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('registrar req.body ',req.body);
  
  const {nombre,tipo,nickname,descripcion,orden} = req.body

  const oldSucursal = await Sucursal.findOne({nombre:nombre})
  if(oldSucursal){
    res.status(400).send({ message: 'Error: Sucursal ya existente.' });
  }else{
    const sucursal = new Sucursal({
      nombre: nombre,
      tipo: tipo,
      nickname: nickname,
      descripcion: descripcion,
      orden: orden,
    });
    const newSucursal = await sucursal.save();
    if (newSucursal) {
      console.log('newSucursal',newSucursal);
      const v_kardexLote = await generarKardexSucursal(nombre,tipo)
      console.log('v_kardexLote',v_kardexLote);
      res.send({
        _id: newSucursal._id,
        nombre: newSucursal.nombre,
        tipo: newSucursal.tipo,
        nickname: newSucursal.nickname,
        descripcion: newSucursal.descripcion,
        orden: newSucursal.orden,
        isActive: newSucursal.isActive,
      })
    } else {
      res.status(401).send({ message: 'Datos de Sucursal invalidos.' });
    }
  }
});

const generarKardexSucursal = async (sucursal,sucursalTipo) =>{
  const kardexLote = await Kardex.find({sucursal:"JuventudFe"})
  console.log('kardexLote',kardexLote);
  if(kardexLote){
    kardexLote.forEach(async function (prod) {
      console.log("Kardex nombre: ", prod.nombre, " kardextipo: ", prod.kardextipo, " sucursal: ", prod.sucursal);
      
      /* const { _id, ...restProd } = prod; */
      const kardexId = await getSecuencia("Kardex");
      /* const newProd = {
        ...restProd, sucursal: sucursal, isApertura: false, stock: 0, stockMin: 0, stockMax: 0,
        promLunes: 0, promMartes: 0, promMiercoles: 0, promJueves: 0, promViernes: 0, promSabado: 0, promDomingo: 0,
        promSemana: 0, manualLunes: 0, manualMartes: 0, manualMiercoles: 0, manualJueves: 0, manualViernes: 0,
        manualSabado: 0, manualSemana: 0, kardexId: kardexId
      }; */
      /* console.log("New Kardex nombre: ", restProd.nombre, " kardextipo: ", restProd.kardextipo, " sucursal: ", newProd.sucursal);
      */
      //const v_newKardex = db.kardexes.insert(newProd)
      const kardex = new Kardex({
        kardexId: kardexId,
        kardextipo: prod.kardextipo,
        nombre: prod.nombre,
        nombreId: prod.nombreId,
        sucursal: sucursal,
        sucursalTipo: sucursalTipo,
        area: prod.area,
        grupo: prod.grupo,
        familia: prod.familia,
        unidad: prod.unidad,
        isApertura: false,
        ultimoPrecio: prod.ultimoPrecio,
        precioPromedio: prod.precioPromedio,
        isAutoProcess: prod.isAutoProcess,
      })
      const newKardex = await kardex.save();
      console.log('newKardex', newKardex);

    })
  } 
  return
}

module.exports = router;