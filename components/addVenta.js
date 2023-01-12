const Venta = require('../models/ventaModel');
//const { getSecuencia } = require('./GetSecuencia');
//const {addKardex} = require('./addKardex')

const addVenta =  async (indice,sucursal,fecha,venta) =>{
  //mongoose.set('useFindAndModify', false);
  //console.log('addKardex',area,tipoKardex,sucursal,productoId,prodReq);
  console.log('addVenta',indice,sucursal,fecha,venta.PRODUCTO);
  if (indice && sucursal,  fecha ) {
      const oldVenta = await Venta.findOne({ indice: indice, sucursal: sucursal,fecha:fecha })
      if (oldVenta) {
        //res.status(400).send({ message: 'Error: kardex ya existe.' });
        console.log('Error: Venta ya existe oldVenta:',oldVenta.producto);
        return
      } else {
        console.log('venta',venta.PRODUCTO);
        const r_venta = new Venta({
            indice: indice,
            sucursal: sucursal,
            fecha: fecha,
            estado: "Procesado",
            categoria: venta.CATEGORIA,
            producto: venta.PRODUCTO,
            cantidad: venta.CANTIDAD,
            precio: venta.PRECIO,
            importe: venta.IMPORTE,
          
        });
        const newVenta = await r_venta.save();
        //console.log('newVenta',newVenta.indice,newVenta.producto);
       
          return newVenta
       
      }
  }else{
      console.log('Error: Venta Falta parametro:',indice,sucursal,fecha);
      return
  }

}

 module.exports = {addVenta:addVenta}