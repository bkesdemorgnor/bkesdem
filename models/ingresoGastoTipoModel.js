const mongoose = require('mongoose');

const ingresogastotipoSchema = new mongoose.Schema({
    ingresoGastoTipoId: { type: String, required: true },
    nombre: { type: String, required: true },          /* Texto que indica el nombre del Ingreso o Gasto */
    nickname: { type: String, required: true },          /* Texto Abreviado del nombre  */
    isEgreso: { type: Boolean, required: true },        /* isEgreso: true = Egreso, false:Ingreso  */
    
}, { timestamps: true });

const ingresogastotipoModel = mongoose.model('Ingresogastotipo', ingresogastotipoSchema);

module.exports = ingresogastotipoModel;
