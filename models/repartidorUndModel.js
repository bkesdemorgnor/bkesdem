const mongoose = require('mongoose');
const repartidorundSchema = new mongoose.Schema({
    repartidorUndId: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    grupo: { type: String, required: true },     
    isEnvioGrupal: { type: Boolean, required: true },     
}, { timestamps: true });

const repartidorundModel = mongoose.model('Repartidorund', repartidorundSchema);

module.exports = repartidorundModel;
