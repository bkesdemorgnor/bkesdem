const mongoose = require('mongoose');
const categoriaSchema = new mongoose.Schema({
    categoriaId: { type: String, required: true },
    nombre: { type: String, required: true },
    area: { type: String, required: true },
    sucursalTipo: { type: String, required: true },
    isSys: { type: Boolean, required: true },
    isActivo: { type: Boolean, required: true },
    estado: { type: String, required: true },
    
}, { timestamps: true });

const categoriaModel = mongoose.model('Categoria', categoriaSchema);

module.exports = categoriaModel;
