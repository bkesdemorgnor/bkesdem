const mongoose = require('mongoose');
  
const pedformdetSchema = new mongoose.Schema({
    pedformId: { type: String, required: true },
    itemId: { type: String, required: true },
    tipoItem: { type: String, required: true },
    nombre: { type: String, required: true },
    familia: { type: String, required: true },
}, { timestamps: true });

const pedformdetModel = mongoose.model('Pedformdet', pedformdetSchema);

module.exports = pedformdetModel;
