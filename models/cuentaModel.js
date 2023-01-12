const mongoose = require('mongoose');
const cuentaSchema = new mongoose.Schema({
    cuentaId: { type: String, required: true },
    nombre: { type: String, required: true },
    usuario: { type: String, required: true },
    estado: { type: String, required: true },
    fechaAsignacion: { type: String },
    montoPresupuesto: { type: Number, required: true },
    montoAsignado:{ type: Number },
    montoReal: { type: Number },
    fechaOperacion: { type: String, required: true },
    tipoOperacion: { type: String, required: true },
    nroOperacion: { type: String},
    diferencia: { type: Number },
    diferTipo: { type: String },
    diferTipoOper: { type: String },
    diferFechaOper: { type: String },
    diferNroOper: { type: String },
    ordenesCompra: [],
    ingresosAlmacen: [],
    
}, { timestamps: true });

const cuentaModel = mongoose.model('Cuenta', cuentaSchema);

module.exports = cuentaModel;
