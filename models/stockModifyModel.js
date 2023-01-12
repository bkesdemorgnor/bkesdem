const mongoose = require('mongoose');
const stockmodifySchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },     // pueden ser Actualizar, Incrementar, Decrementar
}, { timestamps: true });

const stockmodifyModel = mongoose.model('Stockmodify', stockmodifySchema);

module.exports = stockmodifyModel;
