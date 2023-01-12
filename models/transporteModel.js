const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const transporteSchema = new mongoose.Schema({
  transporteId: { type: String, required: true },
  tipo: { type: String, required: true },
  modelo: { type: String, required: true },
  placa: { type: String, required: true }, 
  isActivo: { type: Boolean, required: true, default: true }
},{timestamps:true});

const transporteModel = mongoose.model('Transporte', transporteSchema);

module.exports = transporteModel;
