const mongoose = require('mongoose');
const recetaSchema = new mongoose.Schema({
    recetaId: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    
}, { timestamps: true });

const recetaModel = mongoose.model('Receta', recetaSchema);

module.exports = recetaModel;
