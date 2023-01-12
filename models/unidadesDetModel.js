const mongoose = require('mongoose');
  
const unidadesdetSchema = new mongoose.Schema({
    unidadesId: { type: String, required: true },
    productoId: { type: String, required: true },
    areas: [],
    familia: { type: String, required: true },
    productoNombre: { type: String, required: true },
    productoCantidad: { type: Number, required: true },
    productoUnidad: { type: String, required: true },
    productoFormula: { type: Number, required: true },
    unidadesNombre: { type: String, required: true },
    unidadesCantidad: { type: Number, required: true },
    unidadesUnidad: { type: String, required: true },
    unidadesFormula: { type: Number, required: true },
    isAutoUnidades: { type: Boolean, default:false },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual
}, { timestamps: true });

const unidadesdetModel = mongoose.model('Unidadesdet', unidadesdetSchema);

module.exports = unidadesdetModel;
