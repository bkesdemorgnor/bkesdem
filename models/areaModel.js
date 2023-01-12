const mongoose = require('mongoose');
const areaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
    sucursalTipo: { type: String, required: true },
    isProduccion: { type: Boolean, required: true },
    
}, { timestamps: true });

const areaModel = mongoose.model('Area', areaSchema);

module.exports = areaModel;
