const mongoose = require('mongoose');
const cecomercialSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    simbolo: { type: String, required: true },
    descripcion: { type: String, required: true },
   
}, { timestamps: true });

const cecomercialModel = mongoose.model('Cecomercial', cecomercialSchema);

module.exports = cecomercialModel;
