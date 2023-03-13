const mongoose = require('mongoose');

const unidadesreqSchema = new mongoose.Schema({
    unidadesId: { type: String, required: true },
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    cantidadAte: { type: Number, required: true },
    cantidadPend: { type: Number, required: true },
    unidad: { type: String, required: true},
    estado: { type: String, required: true},
});

const unidadesateSchema = new mongoose.Schema({
    unidadesId: { type: String, required: true },
    nombre: { type: String, required: true },
    fecha: { type: String, required: true },
    cantidadAte: { type: Number, required: true },
    sucursalAte: { type: String, required: true },  /* Usuario que atendio */
    unidad: { type: String},
});

const transfersolSchema = new mongoose.Schema({
    transferSolId: { type: String, required: true },   /* Id de la solicitud de transferencia */
    fechaSol: { type: String, required: true },     /* Fecha de la solicitud */
    mensaje: { type: String, required: true },      /* Texto de la solicitud */
    sucursalSol: { type: String, required: true },  /* Usuario solicitante */
    estado: { type: String, required: true },       /* Estado de la solicitud */
    unidadesSol: [unidadesreqSchema],               /* Arreglo de productos solicitados */
    unidadesAte: [unidadesateSchema],               /* Arreglo de productos solicitados */
    isAutorizado: { type: Boolean, required: true },      /* isActivo: true -> solicitud activa, false -> desactivado */
    isActivo: { type: Boolean, required: true },    /* isActivo: true -> solicitud activa, false -> desactivado */
    
}, { timestamps: true });

const transfersolModel = mongoose.model('Transfersol', transfersolSchema);

module.exports = transfersolModel;
