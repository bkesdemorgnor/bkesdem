const mongoose = require('mongoose');
const guiaremisionSchema = new mongoose.Schema({
    guiaRemisionId: { type: String, required: true },
    nombre: { type: String, required: true },
    fecha: { type: String, required: true },
    destino: { type: String, required: true },
    origen: { type: String, required: true },
    items: [],
    observacionEnvio: { type: String },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    observacionRecepcion: { type: String },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    chofer: { type: String, requerido: true },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    transporte: { type: String},      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    usuarioEnvio: { type: String, requerido: true },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    usuarioReceptor: { type: String },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    estado: { type: String, requerido: true },      // Pueden ser: porValidar, enAutoServicio, enManServicio, fueraServicio
    
}, { timestamps: true });

const guiaremisionModel = mongoose.model('Guiaremision', guiaremisionSchema);

module.exports = guiaremisionModel;
