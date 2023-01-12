const mongoose = require('mongoose');
const pedformSchema = new mongoose.Schema({
    pedformId: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },       
    grupo: { type: String, required: true },       
}, { timestamps: true });

const pedformModel = mongoose.model('Pedform', pedformSchema);

module.exports = pedformModel;
