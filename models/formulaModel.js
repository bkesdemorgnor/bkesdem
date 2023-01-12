const mongoose = require('mongoose');
const formulaSchema = new mongoose.Schema({
    formulaId: { type: String, required: true },
    nombre: { type: String, required: true },
    unidad: { type: String, required: true },
    cantidad: { type: Number, required: true },
    area: { type: String, required: true },
    descripcion: { type: String, required: true },     
    rendimiento: { type: Number, required: true }, 
    isAutoProcess: { type: Boolean, required: true, default:true },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual    
}, { timestamps: true });

const formulaModel = mongoose.model('Formula', formulaSchema);

module.exports = formulaModel;
