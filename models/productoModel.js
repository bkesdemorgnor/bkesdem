const mongoose = require('mongoose');
const productoSchema = new mongoose.Schema({
    productoId: { type: String, required: true },
    nombre: { type: String, required: true },
    familia: { type: String, required: true },
    unidad: { type: String, required: true },
    descripcion: { type: String, required: true },
    areas: [],   
    tipo: { type: String, required: true },      // tipos: Produccion Directa, Produccion Indirecta, Mantenimiento, Publicidad
    isMerma: { type: Boolean, required: true,default:false },
    isBien: { type: Boolean, required: true,default:true },  // isBien: true = Es un Bien, false : Es un servicio
    isAutoProcess: { type: Boolean, default:false },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual
    isAutoUnidades: { type: Boolean, default:false },  // isAutoUnidades: true = Conversion automatico a Unidades, false : Conversion manual
    isPorcionConv: { type: Boolean, default:false },  // si isAutoUnidades = false y isPorcionConv: true = Conversion de Unidades a Porcion, isPorcionConv:false : Conversion de Producto a Unidades
    mermaDesconge: { type: Number, required: true,default:0 },
    mermaCoccion: { type: Number, required: true,default:0 },
    mermaLimpieza: { type: Number, required: true,default:0 },
    grupo: { type: String, required: true },      // grupos: Hidro, Merc, Aba
}, { timestamps: true });

const productoModel = mongoose.model('Producto', productoSchema);

module.exports = productoModel;
