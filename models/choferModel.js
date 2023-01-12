const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const choferSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, index: true, dropDups: true,
  },
  
  isActivo: { type: Boolean, required: true, default: true }
},{timestamps:true});

const choferModel = mongoose.model('Chofer', choferSchema);

module.exports = choferModel;
