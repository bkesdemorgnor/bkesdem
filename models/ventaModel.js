const mongoose = require('mongoose');
const ventaSchema = new mongoose.Schema({
    indice: { type: String, required: true },
    sucursal: { type: String, required: true },
    fecha: { type: String, required: true },
    estado: { type: String, required: true },   //El estado tendra los valores:cargado, procesado
    categoria: { type: String, required: true },
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    importe: { type: Number, required: true },
    observacion: { type: String },
}, { timestamps: true });

const ventaModel = mongoose.model('Venta', ventaSchema);

module.exports = ventaModel;
