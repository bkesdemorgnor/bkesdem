const mongoose = require('mongoose');
const convunidadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    simbolo: { type: String, required: true },
    descripcion: { type: String, required: true },
    valor: { type: Number, required: true },
   
}, { timestamps: true });

const convunidadModel = mongoose.model('Convunidad', convunidadSchema);

module.exports = convunidadModel;
