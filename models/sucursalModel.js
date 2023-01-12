const mongoose = require('mongoose');
const sucursalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true  },
  nickname: { type: String, required: true },
  descripcion: { type: String, required: true },
  orden: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
},{timestamps:true});

const sucursalModel = mongoose.model('Sucursal', sucursalSchema);

module.exports = sucursalModel;
