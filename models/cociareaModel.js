const mongoose = require('mongoose');
const cociareaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },
    
}, { timestamps: true });

const cociareaModel = mongoose.model('Cociarea', cociareaSchema);

module.exports = cociareaModel;
