const mongoose = require('mongoose');
const ordencompradetSchema = new mongoose.Schema({
    ordencompraId: { type: String, required: true },
    productoId: { type: String, required: true },
    productoNombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    total: { type: Number, required: true }, 
}, { timestamps: true });

const ordencompradetModel = mongoose.model('Ordencompradet', ordencompradetSchema);

module.exports = ordencompradetModel;
