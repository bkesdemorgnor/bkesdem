const mongoose = require('mongoose');
const reparteundsolSchema = new mongoose.Schema({
    reparteUndSolId: { type: String, required: true },
    repartidorUndId: { type: String, required: true },
    repartidorTipo: { type: String, required: true },
    fecha: { type: String, required: true },
    fechaEntrega: { type: String, required: true },
    estado: { type: String, required: true },
    grupo: { type: String, required: true },
    nombre: { type: String, required: true },
    isEnvioGrupal: { type: Boolean, required: true },
    isEnvioPorcion: { type: Boolean, required: true, default:true },  // isEnvioPorcion: true = Se envia en transporte como PORCION, false : Se envia como UNIDADES    
    unidadesSol: [],     
}, { timestamps: true });

const reparteundsolModel = mongoose.model('Reparteundsol', reparteundsolSchema);

module.exports = reparteundsolModel;
