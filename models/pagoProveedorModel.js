const mongoose = require('mongoose');
const operacionSchema = new mongoose.Schema({
    monto: { type: Number, required: true },
    fecha: { type: String, required: true },
    tipoOperacion: { type: String, required: true },
    nroOperacion: { type: String},
});

const pagoproveedorSchema = new mongoose.Schema({
    pagoProveedorId: { type: String, required: true },
    nombre: { type: String, required: true },
    proveedorId: { type: String, required: true },
    proveedorNombre: { type: String, required: true },
    usuario: { type: String, required: true },
    estado: { type: String, required: true },
    fecha: { type: String, required: true },
    montoTotal: { type: Number, required: true },
    montoPagado:{ type: Number, required: true },
    saldoPendiente: { type: Number, required: true },
    tipoFinanciacion: { type: String, required: true },
    operaciones:[operacionSchema],
    
    ordenesCompra: [],
    
}, { timestamps: true });

const pagoproveedorModel = mongoose.model('Pagoproveedor', pagoproveedorSchema);

module.exports = pagoproveedorModel;
