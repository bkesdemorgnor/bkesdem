const mongoose = require('mongoose');
const cartaSchema = new mongoose.Schema({
    cartaId: { type: String, required: true },
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: String, required: true },
    recetaId: { type: String },
    recetaNombre: { type: String },
    isSys: { type: Boolean, requerido: true },
    isActivo: { type: Boolean, requerido: true },
    estado: { type: String, requerido: true },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    
}, { timestamps: true });

const cartaModel = mongoose.model('Carta', cartaSchema);

module.exports = cartaModel;
