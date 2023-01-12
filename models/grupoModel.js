const mongoose = require('mongoose');
const grupoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
    
}, { timestamps: true });

const grupoModel = mongoose.model('Grupo', grupoSchema);

module.exports = grupoModel;
