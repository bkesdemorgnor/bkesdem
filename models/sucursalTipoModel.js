const mongoose = require('mongoose');
const sucursalTipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },     // Habra tipo sucursal y central
  descripcion: { type: String, required: true },
},{timestamps:true});

const sucursalTipoModel = mongoose.model('Sucursaltipo', sucursalTipoSchema);

module.exports = sucursalTipoModel;
