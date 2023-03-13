const Kardex = require('../models/kardexModel');
const Unidades = require('../models/unidadesModel');
const Unidadesdet = require('../models/unidadesDetModel');
const Ingrediente = require('../models/ingredienteModel');
const Ingredientedet = require('../models/ingredienteDetModel');
const { getSecuencia } = require('../components/GetSecuencia');
const { min } = require('moment/moment');

const addUnidades =  async (productoId, prodReq) =>{
    console.log('productoId',productoId); 
    console.log('prodReq',prodReq);
    var {nombre,familia,unidad,descripcion,tipo,areas,isMerma,isAutoProcess,isAutoUnidades,isPorcionConv,isBien,mermaDesconge,mermaCoccion,mermaLimpieza, grupo, mUnidades,mIngredientes} = prodReq
    const v_nombre = nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    const v_unidadesNombre = mUnidades.nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
  //nombre = nombre.toUpperCase()
  if(nombre && familia && unidad && descripcion && tipo && grupo){
    const oldUnidades = await Unidades.findOne({nombre:{ $regex: new RegExp(`^${v_unidadesNombre}$`), $options: 'i' }})
    if(oldUnidades){
      console.log('Tiene ya Unidades con el mismo Nombre, oldUnidades',oldUnidades);
      /* Nota.- Aca llego con Unidades ya definidas pero no tiene Unidades detalle con nuevos parametros
        Esto se verifico en proceso previo
      */
      const v_unidadesId = oldUnidades.unidadesId
      console.log('v_unidadesId',v_unidadesId);
      const v_new_UnidadesDet = await addUnidadesDet(v_unidadesId,productoId,prodReq);
      if(v_new_UnidadesDet){
        console.log('Unidades detalle creadas exitosamente v_new_UnidadesDet',v_new_UnidadesDet);
        return oldUnidades
      }else{
        console.log('Unidades detalle NO creadas v_new_UnidadesDet',v_new_UnidadesDet);
        return null
      }    
      //return null
    }else{
      var v_isAutoIngre = false;
      if(mIngredientes.asignar){
        v_isAutoIngre = mIngredientes.isAutoIngre;
      }
      const v_descripcion = descripcion.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      const unidadesId = await getSecuencia("Unidades");
      console.log('unidadesId',unidadesId);
      const unidades = new Unidades({
        unidadesId:unidadesId,
        productoId:productoId,
        nombre: v_unidadesNombre,
        familia: familia,
        unidad: unidad,
        descripcion: v_unidadesNombre,
        tipo: tipo,
        areas: areas,
        isMerma: isMerma,
        isAutoProcess: isAutoProcess,
        isAutoUnidades: isAutoUnidades,
        isAutoIngre: v_isAutoIngre,
        isPorcionConv: isPorcionConv,
        isBien: isBien,
        mermaDesconge: mermaDesconge,
        mermaCoccion: mermaCoccion,
        mermaLimpieza: mermaLimpieza,
        grupo: grupo,
      });
      const newUnidad = await unidades.save();
      if (newUnidad) {
        console.log('newUnidad',newUnidad);
        const v_newUnidadesDet = await addUnidadesDet(unidadesId,productoId,prodReq);
        
        if(v_newUnidadesDet){
            console.log('Unidades detalle creadas exitosamente v_newUnidadesDet',v_newUnidadesDet);
            return newUnidad
        }else{
            console.log('Unidades detalle NO creadas v_newUnidadesDet',v_newUnidadesDet);
            return null
        }
      } else {
        
        console.log('Datos de Unidades Detalle invalidos.',); 
        return null 
      }
    }
  }else{
    console.log('Falta parametro(s) de Unidades.',);
    return null
  }
}
  const addUnidadesDet =  async (unidadesId,productoId,prodReq) =>{
      console.log('addUnidadesDet unidadesId ',unidadesId,"productoId",productoId);
      console.log('addUnidadesDet prodReq ',prodReq);
      const {nombre,familia,unidad,descripcion,tipo,areas,isMerma,isAutoProcess,isAutoUnidades,isBien,mermaDesconge,mermaCoccion,mermaLimpieza, grupo, mUnidades,mIngredientes } = prodReq   
      const oldUnidadesDet = await Unidadesdet.findOne({unidadesId:unidadesId,productoId:productoId})
      if(oldUnidadesDet){
        console.log('Error: Unidades Detalle ya existe oldUnidadesDet',oldUnidadesDet);
        return null
      }else{
        //console.log('oldIngredienteDet',oldIngredienteDet);
        const v_nombre = nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
        const v_unidadesNombre = mUnidades.nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
        const UnidadesDet = new Unidadesdet({
            unidadesId:unidadesId,
            productoId:productoId,
            areas:areas,
            productoNombre:v_nombre,
            familia:familia,
            productoCantidad:mUnidades.unidadesCantidad,
            productoUnidad:unidad,
            productoFormula:mUnidades.productoCantidad,
            unidadesNombre:v_unidadesNombre,
            unidadesCantidad:mUnidades.unidadesCantidad,
            unidadesUnidad:mUnidades.unidad,
            unidadesFormula:mUnidades.productoCantidad,
            isAutoUnidades:isAutoUnidades,
        });
        const newUnidadesDet = await UnidadesDet.save();
        if (newUnidadesDet) {
          console.log('newUnidadesDet',newUnidadesDet);
          return newUnidadesDet
        } else {
          console.log('Datos de Unidades Detalle invalidos. newUnidadesDet',newUnidadesDet);
          return null
        }
      }
 }

 const addIngredientes =  async (unidadesId, prodReq) =>{
  console.log('addIngrredientes',unidadesId,prodReq);
  const {nombre, familia, unidad, descripcion, areas, rendimiento,sucursalTipo,isAutoProcess, grupo, mIngredientes  } = prodReq
  if(nombre && unidad && descripcion){
    const oldIngrediente = await Ingrediente.findOne({nombre:nombre})
    if(oldIngrediente){
      console.log('Ingrediente ya existe', oldIngrediente);
      const v_newIngredientesDet = await addIngredientesDet(oldIngrediente.ingredienteId,unidadesId,prodReq);
      if(v_newIngredientesDet){
        console.log('Ingredientes detalle creadas exitosamente v_newUnidadesDet',v_newIngredientesDet);
      }else{
        console.log('Ingredientes detalle NO creadas v_newUnidadesDet',v_newIngredientesDet);
      }
      return oldIngrediente
    }else{
      const v_ingredienteNombre = mIngredientes.nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      const ingredienteId = await getSecuencia("Ingrediente");
      console.log('ingredienteId', ingredienteId);
      const ingrediente = new Ingrediente({
        ingredienteId: ingredienteId,
        unidadesId: unidadesId,
        nombre: v_ingredienteNombre,
        familia: familia,
        unidad: mIngredientes.unidad,
        descripcion: v_ingredienteNombre,
        areas:areas,
        sucursalTipo:"Sede",
        rendimiento:mIngredientes.ingredienteCantidad,
        isAutoProcess:isAutoProcess,
        grupo:grupo,
      });
      const newIngrediente = await ingrediente.save();
      if (newIngrediente) {
        console.log('newIngrediente',newIngrediente);
        const v_newIngredientesDet = await addIngredientesDet(ingredienteId,unidadesId,prodReq);
        
        if(v_newIngredientesDet){
            console.log('Ingredientes detalle creadas exitosamente v_newUnidadesDet',v_newIngredientesDet);
        }else{
            console.log('Ingredientes detalle NO creadas v_newUnidadesDet',v_newIngredientesDet);
        }
        return newIngrediente
      } else {
        
        console.log('Error en Datos de Ingrediente invalidos.',newIngrediente);
        return newIngrediente
      }
    }

  }else{
    console.log('Faltan Datos en creacion de Ingrediente.');
    return null
  }
 }

 const addIngredientesDet =  async (ingredienteId,unidadesId,prodReq) =>{
  console.log('IngredienteDet registrar prodReq ',prodReq);
  const {areas,familia,mUnidades,mIngredientes } = prodReq
  console.log('ingredienteId',ingredienteId);
  console.log('unidadesId',unidadesId);
  
  const oldIngredienteDet = await Ingredientedet.findOne({ingredienteId:ingredienteId,unidadesId:unidadesId})
  if(oldIngredienteDet){
    console.log('Error: Porcion Detalle ya existe oldIngredienteDet',oldIngredienteDet);
    return null
  }else{
    //console.log('oldIngredienteDet',oldIngredienteDet);
    const v_unidadesNombre = mUnidades.nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    const v_ingredienteNombre = mIngredientes.nombre.replace(/^\s+|\s+$|\s+(?=\s)/g, "");  
    const ingredienteDet = new Ingredientedet({
      ingredienteId:ingredienteId,
      unidadesId:unidadesId,
      areas:areas,
      familia:familia,
      unidadesNombre:v_unidadesNombre,
      unidadesCantidad:mUnidades.unidadesCantidad,
      unidadesUnidad:mUnidades.unidad,
      unidadesFormula:mUnidades.productoCantidad,
      ingredienteNombre:v_ingredienteNombre,
      ingredienteCantidad:mIngredientes.ingredienteCantidad,
      ingredienteUnidad:mIngredientes.unidad,
      ingredienteFormula:mIngredientes.unidadesCantidad,
    });
    const newIngredienteDet = await ingredienteDet.save();
    if (newIngredienteDet) {
      console.log('newIngredienteDet',newIngredienteDet);
      return newIngredienteDet
    } else {
      console.log('Datos de Ingrediente Detalle invalidos. newIngredienteDet',newIngredienteDet);
      return newIngredienteDet
    }
  }
 }
 module.exports = {addUnidades:addUnidades,addIngredientes:addIngredientes}