const mongoose = require('mongoose');
const kardextipoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

const kardextipoModel = mongoose.model('Kardextipo', kardextipoSchema);

module.exports = kardextipoModel;
