const mongoose = require('mongoose');
const almacenSchema = new mongoose.Schema({
    almacenId: { type: String, required: true },
    nombre: { type: String, required: true },
    local: { type: String, required: true },
    direccion: { type: String, required: true },
}, { timestamps: true });

const almacenModel = mongoose.model('Almacen', almacenSchema);

module.exports = almacenModel;
