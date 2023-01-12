const mongoose = require('mongoose');
const perfilSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nickname: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, required: true },
},{timestamps:true});

const perfilModel = mongoose.model('Perfil', perfilSchema);

module.exports = perfilModel;
