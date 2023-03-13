const mongoose = require('mongoose');
const ordencompraSchema = new mongoose.Schema({
    ordencompraId: { type: String, required: true },
    nombre: { type: String, required: true },
    nombreProveedor: { type: String, required: true },
    proveedorId: { type: String, required: true },
    direccionProveedor: { type: String },
    sucursal: { type: String, required: true },
    fechaPedido: { type: String, required: true },
    horaPedido: { type: String, required: true },
    fechaEntrega: { type: String },
    fechaAtendido: { type: String },
    grupoDeCompra: { type: String, required: true },
    usuario: { type: String, required: true },
    periodo: {},
    estado: { type: String, required: true },       //Estado tendra los valores: Formulado, Solicitado, Atendido
    isActivo: { type: Boolean, required: true,default:true },
    isRecibido: { type: Boolean, default:false },
    isFormulado: { type: Boolean, default:false },
    isPagado: { type: Boolean, default:false },
    isPresupuestado: { type: Boolean, default:false },
    isAuth: { type: Boolean, default:false },
    montoPedido: { type: Number,default:0 },
    descuento: { type: Number,default:0 },
    gastosEnvio: { type: Number,default:0 },
    montoAPagar: { type: Number,default:0 },
    metodoPago: { type: String, required: true },       //Metodo de Pago tendra los valores: Contado, Credito, ContraEntrega
    detalles: [],
    unidadesDetalles: [],
    productosDetalles: [],
    
}, { timestamps: true });

const ordencompraModel = mongoose.model('Ordencompra', ordencompraSchema);

module.exports = ordencompraModel;
