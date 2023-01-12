const mongoose = require('mongoose');
const ingredienteSchema = new mongoose.Schema({
    ingredienteId: { type: String, required: true },
    nombre: { type: String, required: true },
    unidad: { type: String, required: true },
    descripcion: { type: String, required: true },
    areas: [],      
    rendimiento: { type: Number, required: true }, 
    isAutoProcess: { type: Boolean, required: true, default:true },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual    
    grupo: { type: String, required: true },
    familia: { type: String, required: true },
}, { timestamps: true });

const ingredienteModel = mongoose.model('Ingrediente', ingredienteSchema);

module.exports = ingredienteModel;
