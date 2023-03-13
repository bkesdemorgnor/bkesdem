const mongoose = require('mongoose');

const kardexDetSchema = new mongoose.Schema({
    kardexDetId: {  type: String, required: true },
    kardexId: {  type: String, required: true },
    fecha: { type: String, required: true },
    descripcion: { type: String, required: true },
    isIngreso: { type: Boolean, required: true,default:true },
    ingresoCantidad: { type: Number, required: true,default:0 },
    ingresoPrecio: { type: Number, required: true,default:0 },
    ingresoTotal: { type: Number, required: true,default:0 },
    salidaCantidad: { type: Number, required: true,default:0 },
    salidaPrecio: { type: Number, required: true,default:0 },
    salidaTotal: { type: Number, required: true,default:0 },
    saldoCantidad: { type: Number, required: true,default:0 },
    saldoPrecio: { type: Number, required: true,default:0 },
    saldoTotal: { type: Number, required: true,default:0 },
    
}, { timestamps: true });

const kardexDetModel = mongoose.model('Kardexdet', kardexDetSchema);

module.exports = kardexDetModel;
