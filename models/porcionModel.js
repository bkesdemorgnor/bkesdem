const mongoose = require('mongoose');
const porcionSchema = new mongoose.Schema({
    porcionId: { type: String, required: true },
    nombre: { type: String, required: true },
    isPorcionPermi: { type: Boolean, required: true }, /* valores: isPorcionPermi = true -> Tiene en Detalle "Porcion", isPorcionPermi = false -> NO puede tener en Detalles "Porcion" */
    unidad: { type: String, required: true },
    descripcion: { type: String, required: true },     
    areas: [],      
    rendimiento: { type: Number, required: true }, 
    isAutoProcess: { type: Boolean, required: true, default:true },  // isAutoProcess: true = Es proceso automatico, false : Es proceso manual    
    isEnvioPorcion: { type: Boolean, required: true, default:true },  // isEnvioPorcion: true = Se envia en transporte como PORCION, false : Se convierte a unidades y se envia como UNIDADES    
    grupo: { type: String, required: true },
    familias: [],
    precio: { type: Number, required: true },
}, { timestamps: true });

const porcionModel = mongoose.model('Porcion', porcionSchema);

module.exports = porcionModel;
