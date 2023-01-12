//const Ordencompra = require('../models/ordencompraModel');
const Ordencompradet = require('../models/ordencompraDetModel');

/* Adicionar detalles de Orden de Compra de Detalles de Productos */

const addOCPDetalles =  async (ordencompraId,ocDetalles) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addPedidosDet',ordencompraId, ocDetalles);
    if (ordencompraId) {
        if(ocDetalles){
            const ordenesCompraDetalles = ocDetalles.map((oc)=>{return ({
                ordencompraId: ordencompraId,
                productoId: oc.productoId,
                productoNombre: oc.nombre,
                cantidad: oc.totalReqProd,
                precioUnitario: oc.ultimoPrecio,
                total: oc.total,
          })
        })
        console.log('ordenesCompraDetalles',ordenesCompraDetalles);
        //const newOrdenesCompraDetalles = await Ordencompradet.insertMany(ordenesCompraDetalles)
        await Ordencompradet.insertMany(ordenesCompraDetalles)
        
        return
      }
    }
    return
 }

 module.exports = {addOCPDetalles:addOCPDetalles}