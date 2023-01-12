const express = require('express');
const Stockmodify = require('../models/stockModifyModel');
const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  console.log('get Stockmodify')
  const oldStockmodifys = await Stockmodify.find({}).sort({ "nombre": -1 }).limit(25);
  console.log('oldStockmodifys',oldStockmodifys)
  if(oldStockmodifys.length>0){
    res.send(oldStockmodifys);
    console.log('oldStockmodifys',oldStockmodifys)
}else{
    console.log('StockModifys no encontradas',oldStockmodifys)
    res.status(404).send({ message: 'StockModifys no encontradas' });
  }
});


router.post('/registrar', async (req, res) => {
  console.log('Stock Modify registrar req.body ',req.body);
  const {nombre,tipo}= req.body

  const oldStockmodify = await Stockmodify.findOne({nombre:req.body.nombre})
  if(oldStockmodify){
    res.status(400).send({ message: 'Error: Stockmodify ya existente.' });
  }else{
    const stockmodify = new Stockmodify({
      nombre: nombre,
      tipo: tipo,
    });
    const newStockModify = await stockmodify.save();
    if (newStockModify) {
      console.log('newStockModify',newStockModify);
      res.send({
        _id: newStockModify._id,
        nombre: newStockModify.nombre,
        tipo: newStockModify.tipo,
      })
    } else {
      res.status(401).send({ message: 'Datos de Stockmodify invalidos.' });
    }
  }
});

module.exports = router;