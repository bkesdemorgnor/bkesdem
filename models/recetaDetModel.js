const mongoose = require('mongoose');
const recetadetSchema = new mongoose.Schema({
    recetaId: { type: String, required: true },
    nombre: { type: String, required: true },
    itemId: { type: String, required: true },
    tipoItem: { type: String, required: true },
    cantidad: { type: Number, required: true },
    
}, { timestamps: true });

const recetadetModel = mongoose.model('Recetadet', recetadetSchema);

module.exports = recetadetModel;
