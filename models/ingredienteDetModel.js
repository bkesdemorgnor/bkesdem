const mongoose = require('mongoose');
  
const ingredientedetSchema = new mongoose.Schema({
    ingredienteId: { type: String, required: true },
    unidadesId: { type: String, required: true },
    areas: [],
    familia: { type: String, required: true },
    unidadesNombre: { type: String, required: true },
    unidadesCantidad: { type: Number, required: true },
    unidadesUnidad: { type: String, required: true },
    unidadesFormula: { type: Number, required: true },
    ingredienteNombre: { type: String, required: true },
    ingredienteCantidad: { type: Number, required: true },
    ingredienteUnidad: { type: String, required: true },
    ingredienteFormula: { type: Number, required: true },
}, { timestamps: true });

const ingredientedetModel = mongoose.model('Ingredientedet', ingredientedetSchema);

module.exports = ingredientedetModel;
