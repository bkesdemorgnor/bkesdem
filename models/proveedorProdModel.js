const mongoose = require('mongoose');
  
const proveedorprodSchema = new mongoose.Schema({
    proveedorId: { type: String, required: true },
    proveedorNombre: { type: String, required: true },
    productoId: { type: String, required: true },
    productoNombre: { type: String, required: true },
   
}, { timestamps: true });

const proveedorprodModel = mongoose.model('Proveedorprod', proveedorprodSchema);

module.exports = proveedorprodModel;
