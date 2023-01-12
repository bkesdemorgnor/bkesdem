
const Kardexdet = require('../models/kardexDetModel');
const Kardex = require('../models/kardexModel');
const { getSecuencia } = require('../components/GetSecuencia');


const regIngresoKardex =  async (datosIngreso) =>{
    console.log('datosIngreso',datosIngreso);
    const {nombreId,sucursal,Cantidad,fecha,descripcion} = datosIngreso
    
    const oldKardex = await Kardex.findOne({nombreId:nombreId,sucursal:sucursal});
    if(oldKardex){
        const kardexId = oldKardex.kardexId
        console.log('oldKardex',oldKardex,"kardexId",kardexId);
        const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
        const kardexDetId = await getSecuencia("Kardexdetalle");
        if(oldkardexDet && kardexDetId){
            console.log('oldkardexDet',oldkardexDet[0]);
            const newKardexDet = await saveRegKardexDetalle(datosIngreso,oldkardexDet[0],kardexId,kardexDetId)
            console.log('newKardexDet',newKardexDet);
            return newKardexDet
        }else{
            console.log('No tiene kardex de Apertura, creamos la apertura');
            const newKardexDetApertura = await outAperturaKardexDetalle(datosIngreso,kardexId,kardexDetId)
            return newKardexDetApertura
        }
    }else{
        console.log('Error no tiene oldKardex',oldKardex);
        return null
    }
}

const saveRegKardexDetalle =  async (datosIngreso,oldkardexDet,kardexId,kardexDetId) =>{
    console.log('datosIngreso',datosIngreso);
    const {nombreId,sucursal,Cantidad,fecha,descripcion, Total, Precio} = datosIngreso

    const v_saldoCantidad = oldkardexDet.saldoCantidad
    const v_saldoPrecio = oldkardexDet.saldoPrecio
    const v_saldoTotal = oldkardexDet.saldoTotal
    console.log('regIngresoKardex oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
    // Es salida de Kardex detallado
    //const v_Total = parseFloat(v_saldoPrecio) * parseFloat(Cantidad)
    var v_newSaldoTotal = parseFloat(v_saldoTotal) + parseFloat(Total)
    var v_newSaldoCantidad = parseFloat(v_saldoCantidad) + parseFloat(Cantidad)
    if(v_newSaldoCantidad === 0){
        v_newSaldoPrecio = parseFloat(v_saldoPrecio)
    }else{
        var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    //var v_newIngresoTotal = Cantidad * v_saldoPrecio
    console.log('regIngresoKardex newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    var kardexDet = new Kardexdet({
        kardexId: kardexId,
        kardexDetId: kardexDetId,
        fecha: fecha,
        descripcion: descripcion,
        ingresoCantidad: parseFloat(Cantidad),
        ingresoPrecio: Precio,
        ingresoTotal: Total,
        saldoCantidad: v_newSaldoCantidad,
        saldoPrecio: v_newSaldoPrecio,
        saldoTotal: v_newSaldoTotal,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = await updateStockProm(kardexId,newKardexDet)
        console.log('regIngresoKardex newKardex',newKardex);
        //res.send(newKardexDet)
        console.log('regIngresoKardex newKardexDet',newKardexDet);
        return newKardexDet
    } else {
        //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
        return null
    }
    
}

const outAperturaKardexDetalle =  async (reqBody,kardexId,kardexDetId) =>{
    // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
      // Es primer registro de Salida, salida sin ingreso, es negativo
    console.log('outAperturaKardexDetalle KardexDet salida reqBody ',reqBody);
    const {fecha,descripcion,Cantidad,Precio,Total} = reqBody

      var kardexDet = new Kardexdet({
        kardexId: kardexId,
        kardexDetId: kardexDetId,
        fecha: fecha,
        descripcion: descripcion,
        ingresoCantidad: parseFloat(Cantidad),
        ingresoPrecio: Precio,
        ingresoTotal: Total,
        saldoCantidad: parseFloat(Cantidad),
        saldoPrecio: Precio,
        saldoTotal: Total,
      });
      const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        const newKardex = await updateStockProm(kardexId,newKardexDet)
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

const regLoteIngresoKardex =  async (loteIngreso) =>{
    console.log('regLoteIngresoKardex registro de lote de Ingreso body', loteIngreso)
    let v_result = undefined
    var qtyErrores = 0
    var qtyMontoTotal = 0
    //Pendiente analizar cuando viene mas de uno
    // Vamos a forzar que solo viene uno
    //var qtyRegIngreso = loteIngreso.length
    var qtyRegIngreso = 1
    try {
        const newRegIngreso = await regIngresoKardex(loteIngreso);
        if(newRegIngreso){
            console.log('newRegIngreso exitoso:',newRegIngreso);
            const v_ingresoTotal = newRegIngreso.ingresoTotal
            qtyMontoTotal = qtyMontoTotal + parseFloat(v_ingresoTotal)
            console.log('v_ingresoTotal',v_ingresoTotal,"qtyMontoTotal",qtyMontoTotal);
            //return {salidaTotal:v_salidaTotal,qtyErrores:qtyErrores,qtyMontoTotal:qtyMontoTotal}
          }else{
            console.log('newRegIngreso',newRegIngreso);
            qtyErrores = qtyErrores+1
            //return {salidaTotal:v_salidaTotal,qtyErrores:qtyErrores,qtyMontoTotal:qtyMontoTotal}
          }
        /* console.log('loteIngreso.length',qtyRegIngreso);
        //v_result = await loteIngreso.forEach(async (ls)=>{
        for (let ls of loteIngreso){
          console.log('ls',ls);
          const newRegIngreso = await regIngresoKardex(ls);
          if(newRegIngreso){
            console.log('newRegIngreso exitoso:',newRegIngreso);
            const v_ingresoTotal = newRegIngreso.ingresoTotal
            qtyMontoTotal = qtyMontoTotal + parseFloat(v_ingresoTotal)
            console.log('v_ingresoTotal',v_ingresoTotal,"qtyMontoTotal",qtyMontoTotal);
            //return {salidaTotal:v_salidaTotal,qtyErrores:qtyErrores,qtyMontoTotal:qtyMontoTotal}
          }else{
            console.log('newRegIngreso',newRegIngreso);
            qtyErrores = qtyErrores+1
            //return {salidaTotal:v_salidaTotal,qtyErrores:qtyErrores,qtyMontoTotal:qtyMontoTotal}
          }
        } */
        
        
        
    } catch (error) {
        console.log('error',error);
        //return null
    }
    v_result = {qtyRegIngreso:qtyRegIngreso,qtyErrores:qtyErrores,qtyMontoTotal:qtyMontoTotal}
    console.log('v_result',v_result);
    //res.send({response1})
    /* var v_resultado = await Promise.all([v_result]) 
    //res.status(200).send('Exitoso Registro');
    console.log('v_result',await v_result); */
   
    return v_result
}


module.exports = {regIngresoKardex:regIngresoKardex,regLoteIngresoKardex:regLoteIngresoKardex}