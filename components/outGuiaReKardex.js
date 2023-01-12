const moment = require('moment');
const Carta = require('../models/cartaModel');
const Recetadet = require('../models/recetaDetModel');
const Categoria = require('../models/categoriaModel');
const Kardex = require('../models/kardexModel');
const Kardexdet = require('../models/kardexDetModel');
const Unidades = require('../models/unidadesModel');
const Producto = require('../models/productoModel');
const Ingrediente = require('../models/ingredienteModel');
const Porcion = require('../models/porcionModel');



const { getSecuencia } = require('./GetSecuencia');


/* Esta funcion decrementara el kardex de los articulos que vienen en el arreglo items
    Inicialmente trataremos por defecto lo que viene como Unidades
    Posteriormente agregaremos un campo donde se indique si lo que vamos a decrementar
    es porciones, unidades o productos
*/

const outGuiaReKardex =  async (items,origen,destino,fecha) =>{
   
    console.log('outGuiaReKardex origen',origen,"destino",destino,"fecha",fecha);
    const v_resulGrabar = items.map(async (item)=>{
        console.log('outGuiaReKardex item',item);
        const v_resulGrabarItem =  item.map(async (ite)=>{
            console.log('ite',ite);
            const v_cantidad = ite.cantidadFinal;
            const v_unidadesId = ite.unidadesId;
            const v_isEnvioPorcion = ite.isEnvioPorcion;
            const v_porcionId = ite.porcionId;
            console.log('outGuiaReKardex v_cantidad',v_cantidad,"v_unidadesId",v_unidadesId,"v_isEnvioPorcion",v_isEnvioPorcion,"v_porcionId",v_porcionId);
            if(v_isEnvioPorcion){
                console.log('outGuiaReKardex v_isEnvioPorcion SI:',v_isEnvioPorcion);
                var oldkardex = await Kardex.findOne({ nombreId: v_porcionId, sucursal: origen})
            }else{
                console.log('outGuiaReKardex v_isEnvioPorcion NO:',v_isEnvioPorcion);
                var oldkardex = await Kardex.findOne({ nombreId: v_unidadesId, sucursal: origen})
            }
            console.log('outGuiaReKardex oldkardex',oldkardex.nombre,oldkardex.sucursal,oldkardex.kardextipo,oldkardex.kardexId,oldkardex.nombreId);

            if(oldkardex){
                console.log('Existe Kardex');
                const descripcion = "Transferencia de:" + origen + " a:" + destino;
                const v_ultimoPrecio = oldkardex.ultimoPrecio
                console.log('oldkardex Existe Kardex v_cantidad:',v_cantidad,"v_ultimoPrecio",v_ultimoPrecio,"fecha",fecha,"descripcion:",descripcion,"oldkardex",oldkardex);
                console.log('oldkardex.kardexId',oldkardex.kardexId);
                const result =  await saveEgresoKardex(v_cantidad,fecha,descripcion,oldkardex) 
                console.log('result',result);
                return result
            }else{
                console.log('NO Existe Kardex');
                return null
            }
                        
        })
        return v_resulGrabarItem
    })
    return v_resulGrabar
}

 

const saveEgresoKardex =  async (cantidad,fecha,descripcion,oldkardex) =>{
    console.log('saveEgresoKardex oldkardex',oldkardex);
    //const descripcion = "Venta de - " + newVenta.producto;
    const v_kardexId = oldkardex.kardexId
    console.log('saveEgresoKardex v_kardexId',v_kardexId);
    if(v_kardexId === undefined){
        console.log('Error v_kardexId es undefined',v_kardexId);
        return null
    }else{
        const resultado = await putEgresoKardex(cantidad,fecha,descripcion,v_kardexId) 
        //console.log('resultado',resultado);
        const resul_stock = await updateStockProm(cantidad,oldkardex,fecha,resultado)
        return resul_stock
        //console.log('resul_stock',resul_stock);
    }
}

const putEgresoKardex =  async (cantidad,fecha,descripcion,kardexId) =>{
    //console.log('putEgresoKardex :',precio,cantidad,total,fecha,descripcion,oldkardex);
    console.log('cantidad',cantidad,"fecha",fecha,"descripcion",descripcion,"kardexId",kardexId);
    const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
    console.log('putEgresoKardex oldkardexDet',oldkardexDet);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('kardexDetId',kardexDetId);
    if (oldkardexDet.length>0) {
        console.log('putEgresoKardex oldkardexDet',oldkardexDet);
        const v_saldoCantidad = oldkardexDet[0].saldoCantidad
        const v_saldoPrecio = oldkardexDet[0].saldoPrecio
        const v_saldoTotal = oldkardexDet[0].saldoTotal
        
        const v_salidaCantidad = cantidad
        console.log('putEgresoKardex v_salidaCantidad',kardexId,v_salidaCantidad);
        const v_newTotalSalida = v_salidaCantidad * v_saldoPrecio
        //var v_newSaldoTotal = v_saldoTotal - total
        var v_newSaldoTotal = v_saldoTotal - v_newTotalSalida  // El nuevo saldo es el precio del kardexdet antiguo x la cantidad de salidad calculada
        var v_newSaldoCantidad = v_saldoCantidad - v_salidaCantidad
        if(v_newSaldoCantidad === 0){
            var v_newSaldoPrecio = v_saldoPrecio
        }else{
            var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
        }
        //console.log('newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
        var kardexDet = new Kardexdet({
          kardexId: oldkardexDet[0].kardexId,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: descripcion,
          isIngreso:false,
          salidaCantidad: v_salidaCantidad,
          salidaPrecio: v_saldoPrecio,          // Ponemos el precio que tenia el saldo del kardexdet antiguo
          salidaTotal: v_newTotalSalida,        // Ponemos el total de salida calculado del kardexdet antiguo + la cantidad de salida calculada por lo que viene en la receta
          saldoCantidad: v_newSaldoCantidad,
          saldoPrecio: v_newSaldoPrecio,
          saldoTotal: v_newSaldoTotal,
        });
        const newKardexDet = await kardexDet.save();
        if(newKardexDet){
            console.log('putEgresoKardex newKardexDet',newKardexDet);
            //await sleep(50)
            return newKardexDet
        }else{
            console.log('Error no hay newKardexDet',newKardexDet);
            return 
        }
    }else{
        console.log('Error: No tiene Kardex de Apertura',oldkardexDet,kardexId);
        return
    }
}


const updateStockProm =  async (cantidad,oldKardex,fecha,newKardexDet) =>{
    console.log("cantidad",cantidad,"oldKardex",oldKardex,"fecha",fecha,"newKardexDet",newKardexDet);
    if(oldKardex && cantidad && fecha && newKardexDet){
        //const numeroDia = new Date(fecha).getDay();
        const numeroDia = moment(fecha).weekday();
        const fechaDeGrabado = moment().format('YYYY-MM-DD');
        const _fechaUpdatedAt = oldKardex.updatedAt
        console.log('fechaDeGrabado',fechaDeGrabado,"_fechaUpdatedAt",_fechaUpdatedAt);
        const [fechaUpdatedAt] = _fechaUpdatedAt.toString().split("T")
        console.log('fechaUpdatedAt',fechaUpdatedAt);
        console.log('numeroDia',oldKardex.kardexId,numeroDia,fecha);
        //console.log('fecha',oldKardex.kardexId,fecha);
        //console.log('recetaCantidad',oldKardex.updatedAt,oldKardex.kardexId,recetaCantidad);
        console.log('cantidad',oldKardex.updatedAt,oldKardex.kardexId,cantidad);
        const v_salidaCantidad = cantidad
        console.log('v_salidaCantidad',oldKardex.kardexId,v_salidaCantidad);
    
        //var v_promedio = oldKardex.promedio;
        const v_OldStock = oldKardex.stock;
        //console.log('v_promedio',v_promedio);
        console.log('v_OldStock',oldKardex.kardexId,v_OldStock);
        console.log('newKardexDet',newKardexDet);
        console.log('newKardexDet.kardexId',newKardexDet.kardexId);
        
    
        const v_total_salida = await Kardexdet.aggregate([
            // First Stage
            {
              $match : { "fecha": { $eq: new Date(fecha)},"kardexId":newKardexDet.kardexId }
            },
            // Second Stage
            {
              $group : {
                 _id : "$kardexId",
                 totalSalidaCantidad: { $sum: "$salidaCantidad" },
                 count: { $sum: 1 }
              }
            },
            // Third Stage
            {
              $sort : { totalSalidaCantidad: -1 }
            }
           ])
          
        console.log('v_total_salida',new Date(fecha),newKardexDet.updatedAt,newKardexDet.kardexId,v_total_salida);
        console.log('v_total_salida[0]',v_total_salida[0],newKardexDet.kardexId);
        const v_totalSalidaCantidad =v_total_salida[0].totalSalidaCantidad;
        console.log('v_totalSalidaCantidad',v_totalSalidaCantidad);
        //console.log('v_total_salida[0].totalSalidaCantidad',v_total_salida[0].totalSalidaCantidad);
    
        var v_newCantidadPromedio = v_salidaCantidad;
        var v_oldPromedioCantidad = 0;
        console.log('numeroDia',oldKardex.kardexId,numeroDia,fecha);
        switch ( numeroDia) {
            case 0:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promDomingo
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Domingo:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Domingo v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promDomingo=v_newCantidadPromedio;
                console.log("Sunday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 1:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promLunes
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Lunes:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Lunes v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promLunes=v_newCantidadPromedio;
                console.log("Monday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 2:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promMartes
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Martes:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Martes v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promMartes=v_newCantidadPromedio;
                console.log("Tuesday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 3:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promMiercoles
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Miercoles:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Miercoles v_newCantidadPromedio:',v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promMiercoles=v_newCantidadPromedio;
                console.log("Wednesday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 4:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promJueves
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Jueves:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Jueves v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promJueves=v_newCantidadPromedio;
                console.log("Thursday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 5:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promViernes
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Viernes:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Viernes v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promViernes=v_newCantidadPromedio;
                console.log("friday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                break;
            case 6:
                if(fechaDeGrabado === fechaUpdatedAt){
                    console.log('Fechas Iguales');
                    v_oldPromedioCantidad = oldKardex.promedio[numeroDia]
                }else{
                    console.log('Fechas NO Iguales');
                    v_oldPromedioCantidad = oldKardex.promSabado
                    oldKardex.promedio[numeroDia] = v_oldPromedioCantidad
                }
                console.log('updateStockProm oldKardex',oldKardex);
                if(v_oldPromedioCantidad !== 0){
                    console.log('Calculo Promedio - Sabado:',oldKardex.kardexId,Number(v_oldPromedioCantidad),v_oldPromedioCantidad, Number(v_totalSalidaCantidad),v_totalSalidaCantidad);
                    v_newCantidadPromedio = (Number(v_oldPromedioCantidad) * 9 + Number(v_totalSalidaCantidad)) / 10;
                    console.log('Viernes v_newCantidadPromedio:',oldKardex.kardexId,v_newCantidadPromedio);
                }else{
                    console.log('v_oldPromedioCantidad Igual a cero:',oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
                }
                oldKardex.promSabado=v_newCantidadPromedio;
                console.log("saturday",oldKardex.kardexId,v_newCantidadPromedio,v_totalSalidaCantidad,v_oldPromedioCantidad);
        }
        //console.log('v_newCantidadPromedio',v_newCantidadPromedio);
        const v_NewStock = newKardexDet.saldoCantidad
        console.log('v_NewStock',oldKardex.kardexId,v_NewStock);
        //oldKardex.promedio = v_promedio;
        oldKardex.stock = v_NewStock;
    
        const v_promedioSemana = oldKardex.promDomingo + oldKardex.promLunes + oldKardex.promMartes + oldKardex.promMiercoles + oldKardex.promJueves + oldKardex.promViernes + oldKardex.promSabado
        oldKardex.promSemana=v_promedioSemana;
        const updatedKardex = await oldKardex.save();
        //console.log('updatedKardex',updatedKardex);
        //await sleep(50)
        return updatedKardex
    }else{
        console.log('Error outGuiaReKardex updateStockProm parametro vacio oldKardex',oldKardex, "newKardexDet",newKardexDet);
        
        return null
    }
}
const sleep =  async (milliseconds) =>{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

 module.exports = {outGuiaReKardex:outGuiaReKardex}