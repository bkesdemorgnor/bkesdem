const Kardex = require('../models/kardexModel');
const { getSecuencia } = require('../components/GetSecuencia');

const addKardex =  async (area,tipoKardex,sucursal,sucursalTipo,productoId,prodReq) =>{

    //mongoose.set('useFindAndModify', false);
    //console.log('addKardex',area,tipoKardex,sucursal,productoId,prodReq);
    //console.log('addKardex 1 prodReq:',prodReq);
    //console.log('addKardex sucursal:',sucursal,sucursalTipo);
    //console.log('addKardex',area,tipoKardex,sucursal,sucursalTipo,productoId);
    if (area && tipoKardex,  sucursal && productoId ) {
      //console.log('addKardex 2 prodReq:',prodReq);
      //console.log('addKardex',prodReq.nombre,sucursal,area,tipoKardex);
      var v_nombre = prodReq.nombre
      var v_precio = prodReq.precio
      switch(tipoKardex){
        case "Ingrediente":
          v_nombre = prodReq.mIngredientes.nombre
          v_precio = prodReq.mIngredientes.precio
          console.log("KARDEX TIPO INGREDIENTE",v_nombre,v_precio);
          break;
        case "Unidades":
          v_nombre = prodReq.mUnidades.nombre
          v_precio = prodReq.mUnidades.precio
          console.log("KARDEX TIPO UNIDADES",v_nombre,v_precio);
          break;
        default:
          console.log("ERROR DE TIPO DE KARDEX");
      }
      const oldkardex = await Kardex.findOne({ nombre: v_nombre, sucursal: sucursal, area: area ,kardextipo:tipoKardex})
      if (oldkardex) {
        //res.status(400).send({ message: 'Error: kardex ya existe.' });
        console.log('Error: kardex ya existe kardexId:',oldkardex);
        return
      } else {
        const kardexId = await getSecuencia("Kardex");
        console.log('kardexId',kardexId);
        const kardex = new Kardex({
          kardexId: kardexId,
          kardextipo: tipoKardex,
          nombre: v_nombre,
          nombreId: productoId,
          sucursal: sucursal,
          sucursalTipo: sucursalTipo,
          area: area,
          grupo: prodReq.grupo,
          familia: prodReq.familia,
          unidad: prodReq.unidad,
          ultimoPrecio: v_precio,
          precioPromedio: v_precio,
          isAutoProcess: prodReq.isAutoProcess,
          promedio:[0,0,0,0,0,0,0],
          manual:[0,0,0,0,0,0,0],
        });
        const newKardex = await kardex.save();
        if (newKardex) {
          return newKardex
        } else {
          return
        }
      }
    }else{
      return
    }
  
 }
 module.exports = {addKardex:addKardex}