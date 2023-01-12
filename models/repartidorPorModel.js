const mongoose = require('mongoose');
const repartidorporSchema = new mongoose.Schema({
    repartidorPorId: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    grupo: { type: String, required: true },     
}, { timestamps: true });

const repartidorporModel = mongoose.model('Repartidorpor', repartidorporSchema);

module.exports = repartidorporModel;
