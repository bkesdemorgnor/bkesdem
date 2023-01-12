const mongoose = require('mongoose');
const lugarcoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

const lugarcoModel = mongoose.model('Lugarco', lugarcoSchema);

module.exports = lugarcoModel;
