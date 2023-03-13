const mongoose = require('mongoose');

const ingresogastoSchema = new mongoose.Schema({
    ingresoGastoId: { type: String, required: true },
    isEgreso: { type: Boolean, required: true },        /* isEgreso: true = Egreso, false:Ingreso  */
    isBien: { type: Boolean, required: true },          /* isBien: true = Bien, false:Servicio  */
    isProveedor: { type: Boolean, required: true },          /* isProveedor: true = Proveedor, false:Acreedor  */
    detalle: { type: String, required: true },          /* Texto que indica el motivo  */
    proveedorAcreedor: { type: String, required: true },    /* Nombre de Proveedor o del Acreedor */
    tipoIngresoGasto: { type: String, required: true },
    tipoFinanciacion: { type: String, required: true },     /* tipoFinanciacion = Credito , Contado */
    metodoOperacion: { type: String, required: true },      /* metodoOperacion = Yape, Transferencia, Plint, Efectivo */
    nroOperacion: { type: String, required: true },     /* nroOperacion = 263454546757 (ejemplo)  */
    fecha: { type: String, required: true },
    montoIngreso: { type: Number },
    montoEgreso:{ type: Number },
    saldo: { type: Number, required: true },
    
}, { timestamps: true });

const ingresogastoModel = mongoose.model('Ingresogasto', ingresogastoSchema);

module.exports = ingresogastoModel;
