const mongoose = require('mongoose');
const unidadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    simbolo: { type: String, required: true },
    descripcion: { type: String, required: true },
   
}, { timestamps: true });

const unidadModel = mongoose.model('Unidad', unidadSchema);

module.exports = unidadModel;
