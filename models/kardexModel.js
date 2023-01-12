const mongoose = require('mongoose');
const kardexSchema = new mongoose.Schema({
    kardexId: { type: String, required: true },
    kardextipo: { type: String, required: true },
    nombre: { type: String, required: true },
    nombreId: { type: String, required: true },
    sucursal: { type: String, required: true },
    sucursalTipo: { type: String, required: true },
    area: { type: String, required: true },
    grupo: { type: String, required: true },
    familia: { type: String, required: true },
    almacenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Almacen'},
    unidad: { type: String, required: true },
    isAutoProcess: { type: Boolean, required: true },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual    
    isApertura: { type: Boolean, required: true,default:false },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual    
    stock: { type: Number, required: true,default:0 },
    stockMin: { type: Number, required: true,default:0 },
    stockMax: { type: Number, required: true,default:0 },
    ultimoPrecio: { type: Number, required: true,default:0 },
    precioPromedio: { type: Number, required: true,default:0 },
    promLunes: { type: Number, required: true,default:0 },
    promMartes: { type: Number, required: true,default:0 },
    promMiercoles: { type: Number, required: true,default:0 },
    promJueves: { type: Number, required: true,default:0 },
    promViernes: { type: Number, required: true,default:0 },
    promSabado: { type: Number, required: true,default:0 },
    promDomingo: { type: Number, required: true,default:0 },
    promSemana: { type: Number, required: true,default:0 },
    manualLunes: { type: Number, required: true,default:0 },
    manualMartes: { type: Number, required: true,default:0 },
    manualMiercoles: { type: Number, required: true,default:0 },
    manualJueves: { type: Number, required: true,default:0 },
    manualViernes: { type: Number, required: true,default:0 },
    manualSabado: { type: Number, required: true,default:0 },
    manualDomingo: { type: Number, required: true,default:0 },
    manualSemana: { type: Number, required: true,default:0 },
    promedio:[0,0,0,0,0,0,0],
    Manual:[0,0,0,0,0,0,0]
}, { timestamps: true });

const kardexModel = mongoose.model('Kardex', kardexSchema);

module.exports = kardexModel;
