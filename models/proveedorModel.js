const mongoose = require('mongoose');
const proveedorSchema = new mongoose.Schema({
    proveedorId: { type: String, required: true },
    nombre: { type: String, required: true },
    cecomercial: { type: String, required: true },
    ruc: { type: String, required: false, default:"" },
    direccion: { type: String, default:"" },
    telefono: { type: String, default:"" },
    contacto: { type: String, default:"" },
    nroctabank: { type: String, default:"" },
    email: { type: String,  unique: true, index: true, dropDups: true },
    familias:[]
}, { timestamps: true });

const proveedorModel = mongoose.model('Proveedor', proveedorSchema);

module.exports = proveedorModel;
