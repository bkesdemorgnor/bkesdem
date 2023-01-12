
const Kardexdet = require('../models/kardexDetModel');
const Kardex = require('../models/kardexModel');

const outKardexDetalle =  async (oldkardexDet,reqBody,kardexDetId) =>{
    
    console.log('outKardexDetalle oldkardexDet:',oldkardexDet);
    console.log('outKardexDetalle KardexDet salida reqBody ',reqBody);
    const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = reqBody

    const v_saldoCantidad = oldkardexDet.saldoCantidad
    const v_saldoPrecio = oldkardexDet.saldoPrecio
    const v_saldoTotal = oldkardexDet.saldoTotal
    console.log('outKardexDetalle oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
    // Es salida de Kardex detallado
    const v_Total = parseFloat(v_saldoPrecio) * parseFloat(Cantidad)
    var v_newSaldoTotal = parseFloat(v_saldoTotal) - v_Total
    var v_newSaldoCantidad = parseFloat(v_saldoCantidad) - parseFloat(Cantidad)
    if(v_newSaldoCantidad === 0){
      v_newSaldoPrecio = parseFloat(v_saldoPrecio)
    }else{
      var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    var v_newSalidaTotal = Cantidad * v_saldoPrecio
    console.log('outKardexDetalle newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: descripcion,
      salidaCantidad: Cantidad,
      salidaPrecio: v_saldoPrecio,
      salidaTotal: v_newSalidaTotal,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = updateStockProm(kardexId,newKardexDet)
        console.log('outKardexDetalle newKardex',newKardex);
        //res.send(newKardexDet)
        console.log('outKardexDetalle newKardexDet',newKardexDet);
        return newKardexDet
    } else {
        //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
        return null
    }
}

const outAperturaKardexDetalle =  async (reqBody,kardexDetId) =>{
    // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
      // Es primer registro de Salida, salida sin ingreso, es negativo
    console.log('outAperturaKardexDetalle KardexDet salida reqBody ',reqBody);
    const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = reqBody

      var kardexDet = new Kardexdet({
        kardexId: kardexId,
        kardexDetId: kardexDetId,
        fecha: fecha,
        descripcion: descripcion,
        salidaCantidad: Cantidad,
        salidaPrecio: Precio,
        salidaTotal: Total,
        saldoCantidad: -Cantidad,
        saldoPrecio: Precio,
        saldoTotal: -Total,
      });
      const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = updateStockProm(kardexId,newKardexDet)
        console.log('outAperturaKardexDetalle newKardex',newKardex);
        //res.send(newKardexDet)
        console.log('outAperturaKardexDetalle newKardexDet',newKardexDet);
        return newKardexDet
    } else {
      //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
      return null
    }
}

const updateStockProm =  async (kardexId,newKardexDet) =>{
    console.log('updateStockProm kardexId',kardexId,"newKardexDet",newKardexDet);
    if(kardexId && newKardexDet){
        //const numeroDia = new Date(fecha).getDay();
        const v_oldKardex = await Kardex.findOne({kardexId:kardexId});
        if(v_oldKardex){
            const v_newStock = newKardexDet.saldoCantidad
            const v_newPrecio = newKardexDet.saldoPrecio
            console.log('updateStockProm v_newStock',v_oldKardex.kardexId,v_newStock);
            //oldKardex.promedio = v_promedio;
            v_oldKardex.stock = v_newStock;
            v_oldKardex.ultimoPrecio = v_newPrecio;
            const updatedKardex = await v_oldKardex.save();
            return updatedKardex
        }else{
            console.log('Error egresoRegKardex updateStockProm parametro vacio oldKardex',v_oldKardex, "newKardexDet",newKardexDet);
            return null
        }        
    }else{
        console.log('Error egresoRegKardex updateStockProm parametro vacio oldKardex',v_oldKardex, "newKardexDet",newKardexDet);
        return null
            
    }
}

module.exports = {outKardexDetalle:outKardexDetalle,outAperturaKardexDetalle:outAperturaKardexDetalle}