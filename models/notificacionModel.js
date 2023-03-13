const mongoose = require('mongoose');
const notificacionSchema = new mongoose.Schema({
    notificacionId: { type: String, required: true },       /* Id de la notificacion */
    origen: { type: String, required: true },       /* sucursal que origina la notificacion */
    destino: { type: String, required: true },      /* sucursal destino de la notificacion */
    fecha: { type: String, required: true }, /* Texto de la notificacion */
    mensaje: { type: String, required: true }, /* Texto de la notificacion */
    procesoId: { type: String, required: true },    /* Texto de la notificacion */
    tipo: { type: String, required: true },         /* tipo: broadcast -> a todos los usuarios, directo -> mensaje a un solo destiono  */
    isActivo: { type: Boolean, required: true },    /* isActivo: true -> notificacion activa, false -> desactivado */
    
}, { timestamps: true });

const notificacionModel = mongoose.model('Notificacion', notificacionSchema);

module.exports = notificacionModel;
