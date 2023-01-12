const mongoose = require('mongoose');
const familiaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    lugarCompra: { type: String, required: true },
    descripcion: { type: String, required: true },
    grupoDeCompras: { type: String, required: true },
}, { timestamps: true });

const familiaModel = mongoose.model('Familia', familiaSchema);

module.exports = familiaModel;
