const mongoose = require('mongoose');
const secuenciaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    codIni: { type: String, required: true },
    nroDig: { type: Number, required: true },
    seq: { type: Number, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

const secuenciaModel = mongoose.model('Secuencia', secuenciaSchema);

module.exports = secuenciaModel;
