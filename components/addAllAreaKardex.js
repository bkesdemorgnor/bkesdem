
const { getSecuencia } = require('../components/GetSecuencia');
const {addKardex} = require('../components/addKardex')


const addAllAreaKardex =  async (tipoKardex,sucursal,productoId,prodReq) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addAllAreaKardex 1:',tipoKardex, sucursal,productoId);
    if (  sucursal ) {
      const s_tipo = sucursal.tipo;
      console.log('s_tipo', s_tipo);
      prodReq.areas.forEach( async (a,i) => {
            // ... do something with s and i ...
        if(a.activo){
          if(a.sucursalTipo === s_tipo){
            console.log('addAllAreaKardex sucursal:',sucursal);
            console.log('addAllAreaKardex prodReq:',prodReq);
            console.log('addAllAreaKardex forEach activo sucursalTipo:',i,a.nombre,a.sucursalTipo,sucursal.nombre,tipoKardex,productoId);
            const respuesta = await addKardex(a.nombre,tipoKardex,sucursal.nombre,sucursal.tipo,productoId,prodReq)
            //await addAllTipKardex(s.nombre,productoId,prodReq)
          }else{
            console.log('addAllAreaKardex Sucursal TIPO No CORRESPONDE', i, sucursal.nombre, a.sucursalTipo,a.nombre);
          }
        }else{
          console.log('addAllAreaKardex Area No activo',i,a.nombre,a.sucursalTipo,sucursal.nombre,tipoKardex,productoId);
        }
      });
    }
    return
 }
 module.exports = {addAllAreaKardex:addAllAreaKardex}