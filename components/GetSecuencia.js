const Secuencia = require('../models/secuenciaModel');
//const mongoose = require('mongoose');

const getSecuencia =  async (nombre) =>{
    //mongoose.set('useFindAndModify', false);
    console.log('getSecuencia',nombre);
    const sequence = await Secuencia.findOne({"nombre": nombre});
    //console.log('sequence',sequence);
    if(sequence){
        const newSecuencia = await Secuencia.findByIdAndUpdate({"_id": sequence._id},{$inc : {'seq' : 1}});
        //console.log('newSecuencia',newSecuencia);
        if(newSecuencia){
            const nroDigitos = newSecuencia.nroDig;
            const v_seq = newSecuencia.seq
            var v_seq_str = v_seq.toString() 
            const l_v_seq_str = v_seq_str.length;
            const v_fill_digitos = nroDigitos-l_v_seq_str;
            if(v_fill_digitos>0){
                const v_ceros_adi = "0".repeat(v_fill_digitos)
                v_seq_str = v_ceros_adi+v_seq_str
            }
            const seq = newSecuencia.codIni + "-"+ v_seq_str
            //console.log('seq',seq);
            return seq
        }else{
            console.log('Error newSecuencia',newSecuencia);
            return "-1"
        }
    }    
 }
 module.exports = {getSecuencia:getSecuencia}