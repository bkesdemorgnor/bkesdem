const mongoose = require('mongoose');
  
const formuladetSchema = new mongoose.Schema({
    formulaId: { type: String, required: true },
    nombreId: { type: String, required: true },
    area: { type: String },
    kardextipo: { type: String, required: true },
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    unidad: { type: String, required: true },
    isRepartoGrupo: { type: Boolean, required: true },
    
}, { timestamps: true });

const formuladetModel = mongoose.model('Formuladet', formuladetSchema);

module.exports = formuladetModel;
