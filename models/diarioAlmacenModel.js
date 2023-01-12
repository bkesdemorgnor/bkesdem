const mongoose = require('mongoose');
const diarioalmacenSchema = new mongoose.Schema({
    diarioAlmacenId: { type: String, required: true },
    ordencompraId: { type: String, required: true },
    proveedorId: { type: String, required: true },
    proveedorNombre: { type: String, required: true },
    proveedorDireccion: { type: String, required: true },
    compraId: { type: String},
    nombre: { type: String, required: true },
    nombreOrdenCompra: { type: String, required: true },
    descripcion: { type: String, required: true },
    docref: { type: String},
    montoAtendido: { type: Number, required: true },
    fechaIngreso: { type: String, required: true },
    horaIngreso: { type: String, required: true },
    grupoDeCompra: { type: String, required: true },
    usuario: { type: String, required: true },
    sucursal: { type: String, required: true },
    estado: { type: String, required: true },
    isRecibido: { type: Boolean, required: true },
    isPagado: { type: Boolean, required: false,default:false },
    compraDetalles:[]
}, { timestamps: true });

const diarioalmacenModel = mongoose.model('Diarioalmacen', diarioalmacenSchema);

module.exports = diarioalmacenModel;
