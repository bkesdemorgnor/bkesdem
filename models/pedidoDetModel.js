const mongoose = require('mongoose');
  
const pedidodetSchema = new mongoose.Schema({
    pedidoId: { type: String, required: true },
    itemId: { type: String, required: true },
    tipoItem: { type: String, required: true },
    nombre: { type: String, required: true },
    consumo: { type: Number,default:0 },
    stock: { type: Number,default:0 },
    stockEmergencia: { type: Number,default:0 },
    pedidoSys: { type: Number,default:0 },
    pedidoSolicitado: { type: Number,default:0 },
    pedidoConsolidado: { type: Number,default:0 },
    itemAtendido: { type: String,default:0 },
    pesoBruto: { type: Number,default:0},
}, { timestamps: true });

const pedidodetModel = mongoose.model('Pedidodet', pedidodetSchema);

module.exports = pedidodetModel;
