const Pedformdet = require('../models/pedformDetModel');
const Pedidodet = require('../models/pedidoDetModel');
//const { getSecuencia } = require('./GetSecuencia');
//const {addKardex} = require('./addKardex')


const addPedidosDet =  async (pedformId,newPedido) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('addPedidosDet',pedformId, newPedido.pedidoId);
    if (pedformId) {
      const pedidoFormDetalles = await Pedformdet.find({pedformId:pedformId})
      if(pedidoFormDetalles){
       /*  pedidoFormDetalles.forEach( async (pfd,i) => {
              // ... do something with s and i ...
              console.log('addPedidosDet pedidoFormDetalles:',i,pfd.pedformId,pfd.tipoItem,pfd.nombre);
              const respuesta = await addPedidoDetalle(pedformId,newPedido,pfd)
              //await addAllTipKardex(s.nombre,productoId,prodReq)
        }); */
        const pedidoDetalles = pedidoFormDetalles.map((pfd)=>{return ({
            pedidoId: newPedido.pedidoId,
            itemId: pfd.itemId,
            tipoItem: pfd.tipoItem,
            nombre: pfd.nombre,
          })
        })
        console.log('pedidoDetalles',pedidoDetalles);
        const allPedidoDetalles = await Pedidodet.insertMany(pedidoDetalles)
        //console.log('allPedidoDetalles',allPedidoDetalles);
        if(allPedidoDetalles){
          console.log('allPedidoDetalles Creados',allPedidoDetalles);
        }else{
          console.log('allPedidoDetalles NO existe',allPedidoDetalles);

        }
        return allPedidoDetalles
      }
    }
    return
 }

 
const addPedidoDetalle =  async (pedformId,newPedido,pfd) =>{
  //mongoose.set('useFindAndModify', false);
  //console.log('addKardex',area,tipoKardex,sucursal,productoId,prodReq);
  console.log('addPedidoDetalle',pedformId,newPedido.pedidoId,newPedido.nombre,pfd.itemId);
  if (pedformId && newPedido,  pfd ) {
      const oldPedidoDet = await Pedidodet.findOne({ pedidoId: newPedido.pedidoId, itemId: pfd.itemId })
      if (oldPedidoDet) {
        //res.status(400).send({ message: 'Error: kardex ya existe.' });
        console.log('Error: Pedido detalle ya existe oldPedidoDet:',oldPedidoDet);
        return
      } else {
        //const kardexId = await getSecuencia("Kardex");
        //console.log('kardexId',kardexId);
        const pedidoDetalle = new Pedidodet({
          pedidoId: newPedido.pedidoId,
          itemId: pfd.itemId,
          tipoItem: pfd.tipoItem,
          nombre: pfd.nombre,
          
        });
        const newPedidoDet = await pedidoDetalle.save();
        if (newPedidoDet) {
          return newPedidoDet
        } else {
          return
        }
      }
  }else{
      return
  }

}

 module.exports = {addPedidosDet:addPedidosDet}