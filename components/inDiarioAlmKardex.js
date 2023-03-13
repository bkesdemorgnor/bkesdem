const moment = require('moment');
const Carta = require('../models/cartaModel');
const Recetadet = require('../models/recetaDetModel');
const Categoria = require('../models/categoriaModel');
const Kardex = require('../models/kardexModel');
const Kardexdet = require('../models/kardexDetModel');
const Unidades = require('../models/unidadesModel');
const Unidadesdet = require('../models/unidadesDetModel');
const Producto = require('../models/productoModel');
const Ingrediente = require('../models/ingredienteModel');
const Porcion = require('../models/porcionModel');



const { getSecuencia } = require('./GetSecuencia');


//const {addKardex} = require('./addKardex')

const inDiarioAlmKardex =  async (reqDatosDiaAlm) =>{
    console.log('reqDatosDiaAlm',reqDatosDiaAlm);
    var {nombre,ordencompraId,nombreOrdenCompra,proveedorId,proveedorNombre,proveedorDireccion,compraId,descripcion,montoAtendido,fechaIngreso,docref,grupoDeCompra,sucursal,compraDetalles} = reqDatosDiaAlm
  
    compraDetalles.forEach( async (ocd,i) => {
        console.log('ocd',ocd);
        console.log('ocd.nombre',ocd.nombre);
        console.log('ocd.nombre.isAutoUnidades',ocd.isAutoUnidades);
        const v_kardexTipo = "Producto"
        
        // Consulta de kardex de Producto
        const oldkardex = await Kardex.findOne({ nombre: ocd.nombre, sucursal: sucursal,kardextipo:v_kardexTipo})
        if(oldkardex){
            console.log('Tiene Kardex oldkardex',oldkardex);
            const v_kardexId = oldkardex.kardexId
            console.log('v_kardexId',v_kardexId);
            // Consulta de kardex Detalle de Producto .sort({ "nombre": -1 }).limit(25)
            const oldkardexDetalle = await Kardexdet.findOne({ kardexId: v_kardexId}).find().sort({$natural:-1}).limit(1);
            console.log('oldkardexDetalle',oldkardexDetalle,v_kardexId);
            if (oldkardexDetalle.length>0) {
                const oldkardexDet = oldkardexDetalle[0]

                // En kardex Detalle de Producto tiene ya registro de apertura
                console.log('Tiene ya registro de apertura',oldkardexDet,v_kardexId);
                const producto = await Producto.findOne({nombre:ocd.nombre})
                if(producto){
                    console.log('Encontrado producto',producto);
                    console.log('Encontrado producto.isAutoUnidades',producto.isAutoUnidades);
                    const v_result_IngresoProducto = await ingresoKardexDetProducto(v_kardexId,proveedorNombre,fechaIngreso,ocd,oldkardexDet,oldkardex)
                    if(producto.isAutoUnidades){
                        console.log('v_result_IngresoProducto',v_result_IngresoProducto,v_kardexId);
                        // Tiene conversion Automatica de Producto a Unidades
                        const v_result_unidades = await ingresoKardexDetUnidades(v_kardexId,proveedorNombre,fechaIngreso,ocd,sucursal)
                        // Para culminar el trasladado del Producto a Unidades
                        console.log('v_result_unidades',v_result_unidades,v_kardexId);
                        // Realizamos la salida del Producto de su kardex de Productos
                        const oldkardexDetalle = await Kardexdet.findOne({ kardexId: v_kardexId}).find().sort({$natural:-1}).limit(1);
                        if(oldkardexDetalle.length>0){
                            console.log('oldkardexDetalle',oldkardexDetalle,v_kardexId);
                            const oldkardexDet = oldkardexDetalle[0]
                            const v_result_SalidaProducto = await salidaKardexDetProducto(v_kardexId,proveedorNombre,fechaIngreso,ocd,oldkardexDet,oldkardex)
                            console.log('v_result_SalidaProducto',v_result_SalidaProducto,v_kardexId);
                        }else{
                            console.log('No Tiene registro de apertura oldkardexDetalle',oldkardexDetalle);
                        }
                    
                    }else{
                        console.log('Error No Tiene autoUnidades ');
    
                    }
                    //const kardexDetId = await getSecuencia("Kardexdet");
                }else{
                    console.log('NO Encontrado producto',producto);
                }
            }else{
                console.log('No Tiene registro de apertura oldkardexDetalle',oldkardexDetalle);
                //console.log('Tiene ya registro de apertura',oldkardexDet);
                const v_result_IngresoProducto = await ingresoKardexDetProductoApertura(v_kardexId,proveedorNombre,fechaIngreso,ocd,oldkardex)
                console.log('v_result_IngresoProducto',v_result_IngresoProducto,v_kardexId);
            }
            
        }else{
            console.log('Error No Tiene Kardex',oldkardex);

        }
    })        
        return 
}


const ingresoKardexDetProducto =  async (kardexId,proveedorNombre,fecha,ocDetalles,old_kardexDet,oldkardex) =>{
    console.log('kardexId',kardexId);
    console.log('ocDetalles',ocDetalles);
    console.log('old_kardexDet',old_kardexDet);
    // Es ingreso de Kardex detallado
    const v_descripcion = "IngCompra "+ oldkardex.nombre + " Prov:"+proveedorNombre
    const v_cantidadEnt = ocDetalles.cantidadEnt
    const v_precioEnt = ocDetalles.precioEnt
    const v_totalEnt = ocDetalles.totalEnt
    console.log('ingresoKardexDetProducto ocDetalles',v_cantidadEnt,v_precioEnt,v_totalEnt,kardexId);
    const v_saldoCantidad = old_kardexDet.saldoCantidad
    const v_saldoPrecio = old_kardexDet.saldoPrecio
    const v_saldoTotal = old_kardexDet.saldoTotal
    console.log('ingresoKardexDetProducto oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal,kardexId);

   

    var v_newSaldoTotal = v_totalEnt + v_saldoTotal
    var v_newSaldoCantidad = v_cantidadEnt + v_saldoCantidad
    if(v_newSaldoCantidad === 0){
        var v_newSaldoPrecio = v_precioEnt 
    }else{
        var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    console.log('ingresoKardexDetProducto newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio,kardexId);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('ingresoKardexDetProducto kardexDetId',kardexDetId);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: v_descripcion,
      ingresoCantidad: v_cantidadEnt,
      ingresoPrecio: v_precioEnt,
      ingresoTotal: v_totalEnt,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
      isIngreso:true,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        console.log('ingresoKardexDetProducto Grabacion correcta de Ingreso de Producto en KardexDet',newKardexDet,kardexId);
        await updateStockPrecio(oldkardex,newKardexDet)
        return newKardexDet
    }else{
        console.log('ingresoKardexDetProducto No se grabo Ingreso de Producto en KardexDet',newKardexDet,kardexId);
        return newKardexDet
    }
}


const ingresoKardexDetProductoApertura =  async (kardexId,proveedorNombre,fecha,ocDetalles,oldkardex) =>{
    console.log('ingresoKardexDetProductoApertura kardexId',kardexId);
    console.log('ingresoKardexDetProductoApertura ocDetalles',ocDetalles);
    //console.log('old_kardexDet',old_kardexDet);
    // Es ingreso de Kardex detallado
    const v_descripcion = "IngCompra "+ oldkardex.nombre + " Prov:"+proveedorNombre
    const v_cantidadEnt = ocDetalles.cantidadEnt
    const v_precioEnt = ocDetalles.precioEnt
    const v_totalEnt = ocDetalles.totalEnt
    console.log('ingresoKardexDetProductoApertura ocDetalles',v_cantidadEnt,v_precioEnt,v_totalEnt);
   

    //var v_newSaldoTotal = v_totalEnt + v_saldoTotal
    var v_newSaldoTotal = v_totalEnt
    //var v_newSaldoCantidad = v_cantidadEnt + v_saldoCantidad
    var v_newSaldoCantidad = v_cantidadEnt
    //var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    var v_newSaldoPrecio = v_precioEnt
    console.log('ingresoKardexDetProductoApertura newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('kardexDetId',kardexDetId);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: v_descripcion,
      ingresoCantidad: v_cantidadEnt,
      ingresoPrecio: v_precioEnt,
      ingresoTotal: v_totalEnt,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
      isIngreso:true,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        console.log('ingresoKardexDetProductoApertura Grabacion correcta de Ingreso de Producto en KardexDet',newKardexDet);
        await updateStockPrecio(oldkardex,newKardexDet)
        return newKardexDet
    }else{
        console.log('ingresoKardexDetProductoApertura No se grabo Ingreso de Producto en KardexDet',newKardexDet);
        return newKardexDet
    }
}


const salidaKardexDetProducto =  async (kardexId,proveedorNombre,fecha,ocDetalles,old_kardexDet,oldkardex) =>{
    console.log('salidaKardexDetProducto kardexId',kardexId);
    console.log('salidaKardexDetProducto ocDetalles',ocDetalles);
    console.log('salidaKardexDetProducto old_kardexDet',old_kardexDet);
    // Es ingreso de Kardex detallado
    const v_descripcion = "Traslado " +oldkardex.nombre + " a Unid Prov:"+proveedorNombre
    const v_cantidadEnt = ocDetalles.cantidadEnt
    const v_precioEnt = ocDetalles.precioEnt
    const v_totalEnt = ocDetalles.totalEnt
    console.log('salidaKardexDetProducto ocDetalles',v_cantidadEnt,v_precioEnt,v_totalEnt,kardexId);
    const v_saldoCantidad = old_kardexDet.saldoCantidad
    const v_saldoPrecio = old_kardexDet.saldoPrecio
    const v_saldoTotal = old_kardexDet.saldoTotal
    console.log('salidaKardexDetProducto oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal,kardexId);

    var v_newSaldoTotal = v_saldoTotal - v_totalEnt
    var v_newSaldoCantidad = v_saldoCantidad - v_cantidadEnt
    if(v_newSaldoCantidad ===0){
        var v_newSaldoPrecio = v_precioEnt
    }else{
        var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    console.log('salidaKardexDetProducto newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio,kardexId);
    const kardexDetId = await getSecuencia("Kardexdetalle");
    console.log('salidaKardexDetProducto kardexDetId',kardexDetId);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: v_descripcion,
      salidaCantidad: v_cantidadEnt,
      salidaPrecio: v_precioEnt,
      salidaTotal: v_totalEnt,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
      isIngreso:false,
    });
    const newKardexDet = await kardexDet.save();
    if (newKardexDet) {
        console.log('salidaKardexDetProducto Grabacion correcta de Salida de Producto en KardexDet',newKardexDet,kardexId);
        await updateStockPrecio(oldkardex,newKardexDet)
        return newKardexDet
    }else{
        console.log('salidaKardexDetProducto No se grabo salida de Producto en KardexDet',newKardexDet,kardexId);
        return newKardexDet
    }
}



const ingresoKardexDetUnidades =  async (kardexId,proveedorNombre,fecha,ocDetalles,sucursal) =>{
    console.log('ingresoKardexDetUnidades kardexId',kardexId);
    console.log('ingresoKardexDetUnidades ocDetalles',ocDetalles);
    //console.log('old_kardexDet',old_kardexDet);

    // Si tiene AutoUnidades, vamos a consultar la tabla de UnidadesDet con el campo productoNombre
    // Vamos a obtener las formulas de conversion de Producto a Unidades
    //const oldUnidadesDet = await Unidadesdet.findOne({ productoNombre: ocDetalles.nombre});
    //const oldUnidadesDet = await Unidadesdet.findOne({ _id: ocDetalles.id});
    const oldUnidadesDet = await Unidadesdet.findOne({ unidadesId: ocDetalles.unidadesId});
    if(oldUnidadesDet){
        console.log('ingresoKardexDetUnidades Tiene autoUnidades oldUnidadesDet',oldUnidadesDet,kardexId);
        const v_unidadesFormula = oldUnidadesDet.unidadesFormula
        const v_unidadesCantidad = oldUnidadesDet.unidadesCantidad
        console.log('ingresoKardexDetUnidades v_unidadesFormula',v_unidadesFormula,v_unidadesCantidad,kardexId);
        console.log('ingresoKardexDetUnidades productoNombre',oldUnidadesDet.productoNombre,kardexId);
        const v_nombreUnidades = oldUnidadesDet.unidadesNombre
        console.log('ingresoKardexDetUnidades v_nombreUnidades',v_nombreUnidades,kardexId);

        // Consulta de kardex de Unidades
        const v_kardexTipo = "Unidades"
        console.log('Datos para buscar kardex unidades',ocDetalles.nombre,sucursal,v_kardexTipo,kardexId);
        const oldkardexUnidad = await Kardex.findOne({ nombre: v_nombreUnidades, sucursal: sucursal,kardextipo:v_kardexTipo})
        if(oldkardexUnidad){
           
            // Tiene Kardex de Unidades
            console.log('Tiene oldkardexUnidad',oldkardexUnidad,kardexId);
            // Consulta de kardex Detalle de Producto .sort({ "nombre": -1 }).limit(25)
            await saveKardexUnidades(oldkardexUnidad,ocDetalles,proveedorNombre,fecha,v_unidadesFormula,v_unidadesCantidad)
            return oldkardexUnidad
        }else{

            console.log('ingresoKardexDetUnidades Error No hay Kardexunidad para Ingreso a Kardexdet',oldkardexUnidad,kardexId);
            return oldkardexUnidad
        }

    }else{
        console.log('ingresoKardexDetUnidades Error No hay Unidadesdet para ingreso de Kardexdet',oldUnidadesDet);
        return oldUnidadesDet
    }
}


const saveKardexUnidades =  async (oldkardexUnidad,ocDetalles,proveedorNombre,fecha,v_unidadesFormula,v_unidadesCantidad) =>{
    console.log('saveKardexUnidades v_unidadesFormula',v_unidadesFormula);
    console.log('saveKardexUnidades v_unidadesCantidad',v_unidadesCantidad);
    console.log('saveKardexUnidades ocDetalles',ocDetalles);
    const v_kardexIdUnidad = oldkardexUnidad.kardexId
    console.log('saveKardexUnidades v_kardexIdUnidad',v_kardexIdUnidad);
    const oldkardexDetalle = await Kardexdet.findOne({ kardexId: v_kardexIdUnidad}).find().sort({$natural:-1}).limit(1);
    console.log('saveKardexUnidades oldkardexDetalle',oldkardexDetalle);
    if(oldkardexDetalle.length>0){
        const oldkardexDet = oldkardexDetalle[0]
        // Es ingreso de Kardex detallado
        const v_descripcion = "Rx xTraslado " + oldkardexUnidad.nombre + " Prov:"+proveedorNombre
        const v_cantidadEnt = (ocDetalles.cantidadEnt * v_unidadesCantidad)/ v_unidadesFormula
        const v_precioEnt =  (ocDetalles.precioEnt * v_unidadesFormula)/  v_unidadesCantidad
        const v_totalEnt = ocDetalles.totalEnt * v_unidadesFormula
        console.log('saveKardexUnidades ocDetalles nuevos',v_unidadesCantidad,v_unidadesFormula,ocDetalles.cantidadEnt,ocDetalles.precioEnt,ocDetalles.totalEnt,v_cantidadEnt,v_precioEnt,v_totalEnt);
        const v_saldoCantidad = oldkardexDet.saldoCantidad
        const v_saldoPrecio = oldkardexDet.saldoPrecio
        const v_saldoTotal = oldkardexDet.saldoTotal
        console.log('saveKardexUnidades oldkardex nuevos saldos',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
    
        var v_newSaldoTotal = v_totalEnt + v_saldoTotal
        var v_newSaldoCantidad = v_cantidadEnt + v_saldoCantidad
        if(v_newSaldoCantidad){
            var v_newSaldoPrecio = v_precioEnt
        }else{
            var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
        }
        console.log('saveKardexUnidades newkardexDet',v_newSaldoCantidad,v_newSaldoPrecio,v_newSaldoTotal);
        const kardexDetId = await getSecuencia("Kardexdetalle");
        console.log('saveKardexUnidades kardexDetId',kardexDetId);
        var kardexDet = new Kardexdet({
          kardexId: v_kardexIdUnidad,
          kardexDetId: kardexDetId,
          fecha: fecha,
          descripcion: v_descripcion,
          ingresoCantidad: v_cantidadEnt,
          ingresoPrecio: v_precioEnt,
          ingresoTotal: v_totalEnt,
          saldoCantidad: v_newSaldoCantidad,
          saldoPrecio: v_newSaldoPrecio,
          saldoTotal: v_newSaldoTotal,
          isIngreso:true,
        });
        const newKardexDet = await kardexDet.save();
        if (newKardexDet) {
            console.log('saveKardexUnidades Grabacion correcta de traslado de Producto a Unidades en KardexDet',newKardexDet);
            await updateStockPrecio(oldkardexUnidad,newKardexDet)
            return newKardexDet
        }else{
            console.log('saveKardexUnidades No se grabo traslado de Producto a Unidades en KardexDet',newKardexDet);
            return newKardexDet
        }
    }else{
        console.log('saveKardexUnidades No hay oldkardexDet',oldkardexDetalle);
    }
    return
}


const updateStockPrecio =  async (oldKardex,newKardexDet) =>{
   
    const v_OldStock = oldKardex.stock;
    console.log('updateStockPrecio v_OldStock',oldKardex.kardexId,v_OldStock);
    console.log('updateStockPrecio oldKardex',oldKardex);
    console.log('updateStockPrecio newKardexDet',newKardexDet);
    console.log('updateStockPrecio newKardexDet.kardexId',newKardexDet.kardexId);

    const v_NewStock = newKardexDet.saldoCantidad
    const v_precioPromedio = newKardexDet.saldoPrecio
    console.log('updateStockPrecio v_NewStock',oldKardex.kardexId,v_NewStock);

    const v_isIngreso = newKardexDet.isIngreso
    if(v_isIngreso){
        // Obtenemos datos de Ingreso
        var v_ingresoPrecio = newKardexDet.ingresoPrecio
    }else{
        var v_ingresoPrecio = newKardexDet.salidaPrecio
    }
    //oldKardex.promedio = v_promedio;
    oldKardex.stock = v_NewStock;
    oldKardex.ultimoPrecio = v_ingresoPrecio;
    oldKardex.precioPromedio = v_precioPromedio;
    console.log('updateStockPrecio oldKardex nuevos datos',v_NewStock,v_ingresoPrecio,v_precioPromedio,oldKardex);

    const updatedKardex = await oldKardex.save();
    if(updatedKardex){
        console.log('Old kardex actualizado CORRECTAMENTE updatedKardex',updatedKardex);
    }else{
        console.log(' Error de actualizacion de Oldkardex',updatedKardex);
    }
    //console.log('updatedKardex',updatedKardex);
    //await sleep(50)
    return updatedKardex
}


 module.exports = {inDiarioAlmKardex:inDiarioAlmKardex}