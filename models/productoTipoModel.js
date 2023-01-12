const mongoose = require('mongoose');
const productotipoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },        // tipos: Produccion Directa, Produccion Indirecta, Mantenimiento, Publicidad
    nickname: { type: String, required: true },
    descripcion: { type: String, required: true },    
}, { timestamps: true });

const productotipoModel = mongoose.model('Productotipo', productotipoSchema);

module.exports = productotipoModel;
