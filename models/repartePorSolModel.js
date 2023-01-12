const mongoose = require('mongoose');
const reparteporsolSchema = new mongoose.Schema({
    repartePorSolId: { type: String, required: true },
    repartidorPorId: { type: String, required: true },
    fecha: { type: String, required: true },
    fechaEntrega: { type: String, required: true },
    estado: { type: String, required: true },
    grupo: { type: String, required: true },
    nombre: { type: String, required: true },
    porcionesSol: [],     
}, { timestamps: true });

const reparteporsolModel = mongoose.model('Reparteporsol', reparteporsolSchema);

module.exports = reparteporsolModel;
