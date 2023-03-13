const mongoose = require('mongoose');
  
const repartidorunddetSchema = new mongoose.Schema({
    unidadesId: { type: String, required: true },
    unidadesNombre: { type: String, required: true },
    repartidorUndId: { type: String, required: true },
    familias: [],
    grupo: { type: String, required: true },
    rendimiento: { type: Number, required: true },
}, { timestamps: true });

const repartidorunddetModel = mongoose.model('Repartidorunddet', repartidorunddetSchema);

module.exports = repartidorunddetModel;
