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


//const {addKardex} = require('./addKardex')

const egresoKardex =  async (indice,sucursal,fecha,venta,newVenta) =>{
    //mongoose.set('useFindAndModify', false);
    //console.log('addKardex',area,tipoKardex,sucursal,productoId,prodReq);
    //console.log('egresoKardex',indice,sucursal,fecha,venta.PRODUCTO);
    if (indice && sucursal,  fecha ) {
        const carta = await Carta.findOne({ nombre: venta.PRODUCTO })
        
        if (carta) {
            //El producto Existe en la Carta
            console.log('Producto en Carta existe:',venta.PRODUCTO);
                
            const Result = await egresoRecetaDetKardex(carta,indice,sucursal,fecha,venta,newVenta)
            //console.log('Result',Result);
            if(Result==="NOk"){
                //console.log('Result NOk');
                const resp2 = await updateVenta(newVenta)
            }else{
                console.log('Result OK');
            }
            
        } else {
            //El producto No Existe en la Carta
            //console.log('Producto en Carta NO existe Categoria:',venta.CATEGORIA,' Producto:',venta.PRODUCTO);
            const resp1 = await addCarta(venta)
            const resp2 = await addCategoria(venta)
            
            // Se Actualiza la nueva Venta con el estado de Cargado
            const resp3 = await updateVenta(newVenta)
        }
        return indice
    }else{
        console.log('Error: Venta Falta parametro:',indice,sucursal,fecha);
        
        return indice
    }
}


const egresoRecetaDetKardex =  async (carta,indice,sucursal,fecha,venta,newVenta) =>{
    if(carta.isActivo){
        if(carta.recetaId !==""){
            // TIENE RECETA
            //console.log('egresoRecetaDetKardex Tiene Receta carta.recetaId !=="":',carta,sucursal,fecha,venta,newVenta);
            const recetaDetalles = await Recetadet.find({ recetaId: carta.recetaId })
            if(recetaDetalles){
                //console.log('recetaDetalles Si tiene detalles',recetaDetalles);
                recetaDetalles.forEach( async (rd,i) => {
                    console.log('recetaDetalles',i,rd);
                    var oldItem = ""
                    switch(rd.tipoItem){
                        case "Porcion":
                            console.log('Porcion',rd.itemId);
                            //const oldkardex = await Kardex.findOne({ nombreId: rd.porcionId, sucursal: sucursal, kardextipo: "Porcion" })
                            oldItem = await Porcion.findOne({ porcionId: rd.itemId})
                            break;
                        case "Ingrediente":
                            console.log('Ingrediente',rd.itemId);
                            oldItem = await Ingrediente.findOne({ ingredienteId: rd.itemId})
                            break;
                        case "Unidades":
                            console.log('Unidades',rd.itemId);
                            oldItem = await Unidades.findOne({ unidadesId: rd.itemId})
                            break;
                        case "Producto":
                            console.log('Producto',rd.itemId);
                            oldItem = await Producto.findOne({ unidadesId: rd.itemId})
                            break;
                        default:
                            console.log('Error de Tipo de Item',rd.tipoItem,rd.itemId);
                            break;
                
                    }
                    if(oldItem.isAutoProcess){
                        console.log('Es AutoProcess',oldItem.nombre,'OldItem',oldItem);
                         //const oldkardex = await Kardex.findOne({ nombreId: rd.porcionId, sucursal: sucursal, kardextipo: "Porcion" })
                        const oldkardex = await Kardex.findOne({ nombreId: rd.itemId, sucursal: sucursal, kardextipo: rd.tipoItem })
                        if (oldkardex) {
                            console.log('Tiene newVenta.producto:',newVenta.producto);
                            const descripcion = "Venta de - " + newVenta.producto;
                            const result =  await saveEgresoKardex(rd.cantidad,newVenta.precio,newVenta.cantidad,newVenta.importe,fecha,descripcion,oldkardex) 
                            console.log('result',result);
                            /* 
                            const resultado = await putEgresoKardex(rd.cantidad,newVenta.precio,newVenta.cantidad,newVenta.importe,fecha,descripcion,oldkardex) 
                            //console.log('resultado',resultado);
                            const resul_stock = await updateStockProm(rd.cantidad,oldkardex,newVenta.cantidad,fecha,resultado) */
                            //console.log('resul_stock',resul_stock);
                        }else{
                            console.log('No tiene oldkardex',oldkardex);

                        }
                    }else{
                        console.log('Es Proceso Manual',oldItem.nombre,'OldItem',oldItem);
                    }
                   
                })
            }else{
                console.log('recetaDetalles NO tiene detalles',recetaDetalles);
            }
            return "OK"
        }else{
            console.log('Producto en Carta no Tiene Receta',carta.nombre);
            return "NOk"
        }
    }else{
        console.log('Producto en Carta no Activo',carta.nombre);
        return "NOk"
    }
}
 
const addCarta =  async (venta) =>{

    //console.log('addCarta venta',venta);
    const cartaId = await getSecuencia("Carta");
    console.log('cartaId',cartaId);
    const carta = new Carta({
        cartaId:cartaId,
        nombre: venta.PRODUCTO,
        categoria: venta.CATEGORIA,
        precio: venta.PRECIO,
        isSys: true,
        isActivo: false,
        estado: "porValidar",
    });
    const newCarta = await carta.save();
    //console.log('newCarta',newCarta);
    return newCarta

}


const addCategoria =  async (venta) =>{
    const nombre = venta.CATEGORIA
    const oldCategoria = await Categoria.findOne({nombre:{ $regex: new RegExp(`^${nombre}$`), $options: 'i' }})
    if(oldCategoria){
        //console.log('Ya existe la Categoria Categoria:',venta.CATEGORIA,' oldCategoria:',oldCategoria);
        return
    }else{
        //Como no existe, creamos la nueva Categoria que viene del SIR
        //console.log('No existe la Categoria, la creamos:',venta.CATEGORIA);
        const categoriaId = await getSecuencia("Categorias");
        const v_categoria = new Categoria({
            categoriaId:categoriaId,
            nombre: venta.CATEGORIA,
            area: "Cocina",
            sucursalTipo: "Sede",
            isSys: true,
            isActivo: false,
            estado: "porValidar",
        });
        const newCategoria = await v_categoria.save();
        //console.log('newCategoria',newCategoria);
        return newCategoria
    }
}

const updateVenta =  async (newVenta) =>{
      // Se Actualiza la nueva Venta con el estado de Cargado, por que se ha subido un nuevo Producto de la Carta y no esta validado 
      
      newVenta.estado = "Cargado"
      const upVenta = await newVenta.save();
      //console.log('upVenta',upVenta.producto);
    return newVenta
}


const saveEgresoKardex =  async (recetaCantidad,precio,cantidad,total,fecha,descripcion,oldkardex) =>{
    //const descripcion = "Venta de - " + newVenta.producto;
    const resultado = await putEgresoKardex(recetaCantidad,precio,cantidad,total,fecha,descripcion,oldkardex) 
    //console.log('resultado',resultado);
    const resul_stock = await updateStockProm(recetaCantidad,oldkardex,cantidad,fecha,resultado)
    return resul_stock
    //console.log('resul_stock',resul_stock);
}

const putEgresoKardex =  async (recetaCantidad,precio,cantidad,total,fecha,descripcion,oldkardex) =>{
    //console.log('putEgresoKardex :',precio,cantidad,total,fecha,descripcion,oldkardex);
    console.log('recetaCantidad',recetaCantidad);
    const oldkardexDet = await Kardexdet.find({ kardexId: oldkardex.kardexId}).find().sort({$natural:-1}).limit(1);
    console.log('putEgresoKardex oldkardexDet',oldkardexDet);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('kardexDetId',kardexDetId);
    if (oldkardexDet.length>0) {
        const v_saldoCantidad = oldkardexDet[0].saldoCantidad
        const v_saldoPrecio = oldkardexDet[0].saldoPrecio
        const v_saldoTotal = oldkardexDet[0].saldoTotal
        //console.log('oldkardexDet saldos:',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
        // Es salida de Kardex detallado
        //console.log('oldkardexDet Es ingreso:',oldkardexDet);
        const v_salidaCantidad = cantidad * recetaCantidad
        console.log('putEgresoKardex l_208 v_salidaCantidad',oldkardex.kardexId,v_salidaCantidad);
        const v_newTotalSalida = v_salidaCantidad * v_saldoPrecio
        //var v_newSaldoTotal = v_saldoTotal - total
        var v_newSaldoTotal = v_saldoTotal - v_newTotalSalida  // El nuevo saldo es el precio del kardexdet antiguo x la cantidad de salidad calculada
        var v_newSaldoCantidad = v_saldoCantidad - v_salidaCantidad
        if(v_newSaldoCantidad<1){
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
            console.log('putEgresoKardex l_232 newKardexDet',newKardexDet);
            //await sleep(50)
            return newKardexDet
        }else{
            console.log('Error no hay newKardexDet',newKardexDet);
            return 
        }
    }else{
        console.log('Error: No tiene Kardex de Apertura',oldkardexDet,oldkardex);
        return
    }
}


const updateStockProm =  async (recetaCantidad,oldKardex,cantidad,fecha,newKardexDet) =>{
    if(recetaCantidad && oldKardex && cantidad && fecha && newKardexDet){
        //const numeroDia = new Date(fecha).getDay();
        const numeroDia = moment(fecha).weekday();
        const fechaDeGrabado = moment().format('YYYY-MM-DD');
        const _fechaUpdatedAt = oldKardex.updatedAt
        console.log('fechaDeGrabado',fechaDeGrabado,"_fechaUpdatedAt",_fechaUpdatedAt);
        const [fechaUpdatedAt] = _fechaUpdatedAt.toString().split("T")
        console.log('fechaUpdatedAt',fechaUpdatedAt);
        console.log('numeroDia',oldKardex.kardexId,numeroDia,fecha);
        //console.log('fecha',oldKardex.kardexId,fecha);
        console.log('recetaCantidad',oldKardex.updatedAt,oldKardex.kardexId,recetaCantidad);
        console.log('cantidad',oldKardex.updatedAt,oldKardex.kardexId,cantidad);
        const v_salidaCantidad = recetaCantidad * cantidad
        console.log('v_salidaCantidad',oldKardex.kardexId,v_salidaCantidad);
    
        //var v_promedio = oldKardex.promedio;
        const v_OldStock = oldKardex.stock;
        //console.log('v_promedio',v_promedio);
        console.log('v_OldStock',oldKardex.kardexId,v_OldStock);
        console.log('newKardexDet',newKardexDet);
        console.log('newKardexDet.kardexId',newKardexDet.kardexId);
        //const v_oldPromedioCantidad = v_promedio[numeroDia]
        /* console.log('v_oldPromedioCantidad',v_oldPromedioCantidad);
        var v_newCantidadPromedio = cantidad;
        if(v_oldPromedioCantidad !== 0){
            v_newCantidadPromedio = (v_oldPromedioCantidad * 9 + cantidad) / 10
        }
        console.log('v_newCantidadPromedio',v_newCantidadPromedio); */
        //v_promedio[numeroDia] = v_newCantidadPromedio;
    
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
        console.log('Error egresoKardex updateStockProm parametro vacio oldKardex',oldKardex, "newKardexDet",newKardexDet);
        
        return null
    }
}
const sleep =  async (milliseconds) =>{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

 module.exports = {egresoKardex:egresoKardex}