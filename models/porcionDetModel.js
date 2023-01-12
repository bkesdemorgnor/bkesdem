const mongoose = require('mongoose');
  
const porciondetSchema = new mongoose.Schema({
    porcionId: { type: String, required: true },
    unidadesId: { type: String, required: true },
    productoId: { type: String, required: true },
    area: { type: String },
    familia: { type: String, required: true },
    unidadesNombre: { type: String, required: true },
    unidadesCantidad: { type: Number, required: true },
    unidadesUnidad: { type: String, required: true },
    unidadesFormula: { type: Number, required: true },
    unidadesReparto: { type: Number, required: true },
    isEnvioGrupal: { type: Boolean, required: true },
    ingredienteNombre: { type: String, required: true },
    ingredienteCantidad: { type: Number, required: true },
    ingredienteUnidad: { type: String, required: true },
    ingredienteFormula: { type: Number, required: true },
}, { timestamps: true });

const porciondetModel = mongoose.model('Porciondet', porciondetSchema);

module.exports = porciondetModel;
