const Sucursal = require('../models/sucursalModel');
//const { getSecuencia } = require('../components/GetSecuencia');
//const { addAllTipKardex } = require('./addAllTipoKardex');
const {addKardex} = require('../components/addKardex')

const addPorcionKardex =  async (porcionId,prodReq) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addPorcionKardex',porcionId,prodReq.nombre);
    if (porcionId) {
        const sucursales = await Sucursal.find({})
        if(sucursales){
          console.log('sucursales',sucursales.nombre);
          sucursales.forEach( async (s,i) => {
            // ... do something with s and i ...
            if(s.isActive){
              console.log('addAllSucKardex Sucursal Activa',i,s.nombre,s);
              await addAllAreaKardex(s,porcionId,prodReq)
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

/*  
const addTipPorcionKardex =  async (sucursal,porcionId,prodReq) =>{
  //mongoose.set('useFindAndModify', false);
  console.log('addAllTipKardex',sucursal,porcionId,prodReq);

  if (sucursal) {
    const s_tipo = sucursal.tipo;
    const kardextipos = { nombre: 'Porciones', nickname: 'POR', descripcion: 'Porciones' }
    console.log('kardextipos', kardextipos);
    console.log('kardextipos.nombre', kardextipos.nombre);
    console.log('addAllTipKardex kardextipos', i, sucursal, k.nombre, k);
    const respuesta = await addAllAreaKardex(kardextipos.nombre, sucursal, porcionId, prodReq)

  }
}
 */

const addAllAreaKardex = async (sucursal, porcionId, prodReq) => {
  //mongoose.set('useFindAndModify', false);
  console.log('addAllAreaKardex:', sucursal, porcionId, prodReq);
  if (sucursal) {
    const s_tipo = sucursal.tipo;
    console.log('s_tipo', s_tipo);
    prodReq.areas.forEach(async (a, i) => {
      // ... do something with s and i ...
      if (a.activo) {
        if(a.sucursalTipo === s_tipo){
          console.log('addAllAreaKardex tipoKardex Sucursal productoId', i, a.nombre, sucursal.nombre, porcionId, a.nombre,a.sucursalTipo);
          const tipoKardex = 'Porcion'
          const respuesta = await addKardex(a.nombre, tipoKardex, sucursal.nombre,sucursal.tipo, porcionId, prodReq)
          //await addAllTipKardex(s.nombre,productoId,prodReq)
        }else{
          console.log('addAllAreaKardex Sucursal TIPO No CORRESPONDE', i, sucursal.nombre, a.sucursalTipo,a.nombre);
        }
      } else {
        console.log('addAllAreaKardex Area No activo', i, a.sucursalTipo,a.nombre);
      }
    });
  }
  return
}
 module.exports = {addPorcionKardex:addPorcionKardex}