const mongoose = require('mongoose');
const moduloSchema = new mongoose.Schema({
    moduloId: { type: String, required: true },
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
}, { timestamps: true });

const moduloModel = mongoose.model('Modulo', moduloSchema);

module.exports = moduloModel;
