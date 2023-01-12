const Sucursal = require('../models/sucursalModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { addAllTipKardex } = require('./addAllTipoKardex');

const addAllSucKardex =  async (productoId,prodReq,unidadesId,ingredienteId) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addAllSucKardex',productoId,unidadesId,ingredienteId,prodReq);
    if (productoId) {
        const sucursales = await Sucursal.find({})
        if(sucursales){
          sucursales.forEach( async (s,i) => {
            // ... do something with s and i ...
            if(s.isActive){
              console.log('addAllSucKardex Sucursal Activa',s.nombre,productoId,prodReq);
              await addAllTipKardex(s,productoId,prodReq,unidadesId,ingredienteId)
            }else{
              console.log('addAllSucKardex Sucursal No activa');
            }
         });
        }else{
          console.log('No hay sucursales');
        }
      }
      return
 }
 module.exports = {addAllSucKardex:addAllSucKardex}