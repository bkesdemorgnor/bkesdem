const mongoose = require('mongoose');
const porcionprodSchema = new mongoose.Schema({
    productoId: { type: String, required: true },
    nombre: { type: String, required: true },
    familia: { type: String, required: true },
    unidad: { type: String, required: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true }      // tipos: Produccion Directa, Produccion Indirecta, Mantenimiento, Publicidad
}, { timestamps: true });

const porcionprodModel = mongoose.model('Porcionprod', porcionprodSchema);

module.exports = productoModel;
