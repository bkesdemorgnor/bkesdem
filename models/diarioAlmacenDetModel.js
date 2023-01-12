const mongoose = require('mongoose');
const diarioalmacendetSchema = new mongoose.Schema({
    diarioAlmacenId: { type: String, required: true },
    tipo: { type: String, required: true },     // este campo puede ser Ingreso, Salida
    cantidad: { type: String, required: true },
    precio: { type: Number, required: true },
    monto: { type: Number, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

const diarioalmacendetModel = mongoose.model('Diarioalmacendet', diarioalmacendetSchema);

module.exports = diarioalmacendetModel;
