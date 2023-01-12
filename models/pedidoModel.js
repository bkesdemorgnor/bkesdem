const mongoose = require('mongoose');
const pedidoSchema = new mongoose.Schema({
    pedidoId: { type: String, required: true },
    nombre: { type: String, required: true },
    fechaPedido: { type: String, required: true },
    fechaAtendido: { type: String },
    grupoDeCompra: { type: String, required: true },
    dias: [],
    sucursal: { type: String, required: true },
    estado: { type: String, required: true },       //Estado tendra los valores: Formulado, Solicitado, Validado, Consolidado, Atendido
    descripcion: { type: String, required: true },
    isActivo: { type: Boolean, required: true },
    pedformId: { type: String, required: true },
    formulario: { type: String, required: true },
    
}, { timestamps: true });

const pedidoModel = mongoose.model('Pedido', pedidoSchema);

module.exports = pedidoModel;
