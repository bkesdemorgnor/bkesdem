const mongoose = require('mongoose');
  
const repartidorpordetSchema = new mongoose.Schema({
    porcionId: { type: String, required: true },
    porcionNombre: { type: String, required: true },
    repartidorPorId: { type: String, required: true },
    familias: [],
    grupo: { type: String, required: true },
    rendimiento: { type: Number, required: true },
}, { timestamps: true });

const repartidorpordetModel = mongoose.model('Repartidorpordet', repartidorpordetSchema);

module.exports = repartidorpordetModel;
