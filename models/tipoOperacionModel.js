const mongoose = require('mongoose');
const tipooperacionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

const tipooperacionModel = mongoose.model('Tipooperacion', tipooperacionSchema);

module.exports = tipooperacionModel;
