const Kardextipo = require('../models/kardexTipoModel');
const { getSecuencia } = require('../components/GetSecuencia');
const {addAllAreaKardex} = require('../components/addAllAreaKardex')

const addAllTipKardex =  async (sucursal,productoId,prodReq,unidadesId,ingredienteId) =>{
    //mongoose.set('useFindAndModify', false);
    //console.log('addAllTipKardex',sucursal,productoId,prodReq);
    console.log('addAllTipKardex',sucursal.nombre,productoId,unidadesId,ingredienteId);

    if (sucursal) {
        /* 
        const kardextipos = await Kardextipo.find({})
        //console.log('kardextipos',kardextipos);
        if(kardextipos){
            kardextipos.forEach( async (k,i) => {
                // ... do something with s and i ...
                
                  //console.log('addAllTipKardex kardextipos',i,sucursal,k.nombre,k);
                  const respuesta = await addAllAreaKardex(k.nombre,sucursal,productoId,prodReq)
                   
             });
        }
        */
       const v_tipoKardex = "Producto"
       const respuesta = await addAllAreaKardex(v_tipoKardex,sucursal,productoId,prodReq)
       console.log('respuesta',respuesta);
       console.log('prodReq.mUnidades.asignar',prodReq.mUnidades.asignar);
       if(prodReq.mUnidades.asignar){
           const v_tipoKardex_unidades = "Unidades"
           const respuesta_unidades = await addAllAreaKardex(v_tipoKardex_unidades,sucursal,unidadesId,prodReq)
           console.log('respuesta_unidades',respuesta_unidades);
        }
        console.log('prodReq.mIngredientes.asignar',prodReq.mIngredientes.asignar);
        if(prodReq.mIngredientes.asignar){
            const v_tipoKardex_ingre = "Ingrediente"
            const respuesta_ingre = await addAllAreaKardex(v_tipoKardex_ingre,sucursal,ingredienteId,prodReq)
            console.log('respuesta_ingre',respuesta_ingre);
         }
    } 
 }
 module.exports = {addAllTipKardex:addAllTipKardex}