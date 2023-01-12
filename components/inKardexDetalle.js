const Kardex = require('../models/kardexModel');
const Kardexdet = require('../models/kardexDetModel');

const inKardexDetalle =  async (oldkardexDet,reqBody,kardexDetId) =>{

    console.log('inKardexDetalle oldkardexDet:',oldkardexDet);
    console.log('inKardexDetalle KardexDet salida reqBody ',reqBody);
    const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = reqBody
    const v_saldoCantidad = oldkardexDet.saldoCantidad
    const v_saldoPrecio = oldkardexDet.saldoPrecio
    const v_saldoTotal = oldkardexDet.saldoTotal
    console.log('inKardexDetalle oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
    // Es ingreso de Kardex detallado
    var v_newSaldoTotal = parseFloat(v_saldoTotal) + parseFloat(Total)
    var v_newSaldoCantidad = parseFloat(v_saldoCantidad) + parseFloat(Cantidad)
    var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    console.log('inKardexDetalle newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: descripcion,
      ingresoCantidad: Cantidad,
      ingresoPrecio: Precio,
      ingresoTotal: Total,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = updateStockProm(kardexId,newKardexDet)
        console.log('inKardexDetalle newKardex',newKardex);
        //res.send(newKardexDet)
        console.log('inKardexDetalle newKardexDet',newKardexDet);
        return newKardexDet
    } else {
      //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
      return null
    }
}

const inAperturaKardexDetalle =  async (reqBody,kardexDetId) =>{
    // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
      // Es primer registro de Salida, salida sin ingreso, es negativo
    console.log('inAperturaKardexDetalle KardexDet salida reqBody ',reqBody);
    const {kardexId,fecha,descripcion,Cantidad,Precio,Total,isIngreso} = reqBody

      var kardexDet = new Kardexdet({
        kardexId: kardexId,
        kardexDetId: kardexDetId,
        fecha: fecha,
        descripcion: descripcion,
        ingresoCantidad: Cantidad,
        ingresoPrecio: Precio,
        ingresoTotal: Total,
        saldoCantidad: Cantidad,
        saldoPrecio: Precio,
        saldoTotal: Total,
      });
      const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = updateStockProm(kardexId,newKardexDet)
        console.log('inAperturaKardexDetalle newKardex',newKardex);
        //res.send(newKardexDet)
        console.log('inAperturaKardexDetalle newKardexDet',newKardexDet);
        return newKardexDet
    } else {
      //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
      return null
    }
}

const updateStockProm =  async (kardexId,newKardexDet) =>{
    console.log('inKardex updateStockProm kardexId',kardexId,"updateStockProm newKardexDet",newKardexDet);
    if(kardexId && newKardexDet){
        //const numeroDia = new Date(fecha).getDay();
        const v_oldKardex = await Kardex.findOne({kardexId:kardexId});
        if(v_oldKardex){
            const v_newStock = newKardexDet.saldoCantidad
            const v_newPrecio = newKardexDet.saldoPrecio
            console.log('inKardex updateStockProm v_newStock',v_oldKardex.kardexId,v_newStock);
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


module.exports = {inKardexDetalle:inKardexDetalle,inAperturaKardexDetalle:inAperturaKardexDetalle}