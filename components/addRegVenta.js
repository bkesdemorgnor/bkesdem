const Venta = require('../models/ventaModel');
//const { getSecuencia } = require('./GetSecuencia');
//const {addKardex} = require('./addKardex')

const addRegVenta =  async (venta) =>{
    console.log('addRegVenta venta',venta);
    const {id,sucursal,cantidad,precio,total,producto,hora,fecha,categoria,observacion} = venta
    console.log('addRegVenta',id,sucursal,cantidad,precio,fecha,hora,total,producto,categoria,observacion);
    if(venta){
        const oldVenta = await Venta.findOne({ indice: id, sucursal: sucursal,producto:producto,fecha:fecha })
        if (oldVenta) {
          //res.status(400).send({ message: 'Error: kardex ya existe.' });
          console.log('Error: Venta ya existe oldVenta:',oldVenta.producto);
          return
        } else {
          console.log('venta',producto);
          const r_venta = new Venta({
              indice: id,
              sucursal: sucursal,
              fecha: fecha,
              estado: "Procesado",
              categoria: categoria,
              producto: producto,
              cantidad: cantidad,
              precio: precio,
              importe: total,
              observacion: observacion,
            
          });
          const newVenta = await r_venta.save();
          return newVenta
        }
    }else{
        console.log('Error: Venta Falta parametro:',id,sucursal,producto);
        return
    }

}

 module.exports = {addRegVenta:addRegVenta}