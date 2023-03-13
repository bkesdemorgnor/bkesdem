const mongoose = require('mongoose');
  
const porciondetSchema = new mongoose.Schema({
    porcionId: { type: String, required: true },
    unidadesId: { type: String, required: true },   //este campo tendra el Id del tipo elegido, si es unidades sera unidadesId, si es Ingrediente ira el ingredienteId y si es Porcion, ira porcionId
    productoId: { type: String, required: true },   /* Este campo ira el Id padre del Id de unidades elegido en tipo */
    tipo: { type: String, required: true },         /* este campo tendra los valores: Unidades, Ingrediente, Porcion */
    area: { type: String },
    familias: [],
    unidadesNombre: { type: String, required: true },   /* tendra el Nombre del tipo elegido */
    unidadesCantidad: { type: Number, required: true }, /* tendra el Cantidad del tipo elegido */
    unidadesUnidad: { type: String, required: true },   /* tendra la Unidad del tipo elegido */
    unidadesFormula: { type: Number, required: true },  /* tendra la Formula del tipo elegido */
    unidadesReparto: { type: Number, required: true },  /* tendra la Reparto del tipo elegido */
    isUnidadesAltRep: { type: Boolean,default:false },  /* tendra la Reparto del tipo elegido */
    unidadesIdAltRep: { type: String },
    productoIdAltRep: { type: String },
    unidadesNombreAltRep: { type: String },
    unidadesCantidadAltRep: { type: Number },
    unidadesRepartoAltRep: { type: Number },
    isEnvioGrupal: { type: Boolean, required: true },
    ingredienteNombre: { type: String, required: true },    /* tendra el Nombre del hijo(ingrediente) tipo elegido */
    ingredienteCantidad: { type: Number, required: true },  /* tendra la Cantidad del hijo(ingrediente) tipo elegido */
    ingredienteUnidad: { type: String, required: true },    /* tendra la Unidad del hijo(ingrediente) tipo elegido */
    ingredienteFormula: { type: Number, required: true },   /* tendra la Formula del hijo(ingrediente) tipo elegido */
}, { timestamps: true });

const porciondetModel = mongoose.model('Porciondet', porciondetSchema);

module.exports = porciondetModel;
