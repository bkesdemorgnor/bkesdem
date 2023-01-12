//const Ordencompra = require('../models/ordencompraModel');
const Ordencompradet = require('../models/ordencompraDetModel');

const addOCDetalles =  async (ordencompraId,ocDetalles) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addPedidosDet',ordencompraId, ocDetalles);
    if (ordencompraId) {
        if(ocDetalles){
            const ordenesCompraDetalles = ocDetalles.map((oc)=>{return ({
                ordencompraId: ordencompraId,
                productoId: oc.productoId,
                productoNombre: oc.productoNombre,
                cantidad: oc.cantidad,
                precioUnitario: oc.precioUnitario,
                total: oc.total,
          })
        })
        console.log('ordenesCompraDetalles',ordenesCompraDetalles);
        //const newOrdenesCompraDetalles = await Ordencompradet.insertMany(ordenesCompraDetalles)
        await Ordencompradet.insertMany(ordenesCompraDetalles)
        //console.log('allPedidoDetalles',allPedidoDetalles);
        /* if(newOrdenesCompraDetalles){
          console.log('newOrdenesCompraDetalles Creados',newOrdenesCompraDetalles);
        }else{
          console.log('newOrdenesCompraDetalles NO creados ',newOrdenesCompraDetalles);

        } */
        //return newOrdenesCompraDetalles
        return
      }
    }
    return
 }

 module.exports = {addOCDetalles:addOCDetalles}