const express = require('express');
const Kardex = require('../models/kardexModel');
const Kardexdet = require('../models/kardexDetModel');
const { getSecuencia } = require('../components/GetSecuencia');
const moment = require('moment');

const { getToken, isAuth } = require( '../util');

const router = express.Router();


router.get("/", isAuth, async (req, res) => {
  //console.log('get users', req )
  const kardexes = await Kardex.find({}).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexes);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
  }
});

/* Obtener todos los kardexs de una sucursal */
router.post("/sucursal", isAuth, async (req, res) => {
  console.log('kardex get sucursal params', req.params)
  console.log('kardex get sucursal body', req.body)
  const {sucursal, area} = req.body;
  
  const kardexes = await Kardex.find({sucursal:sucursal}).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(kardexes);
    //console.log('kardexes',kardexes)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
  }
});

/* Obtener todos los kardex de una sucursal con un nombreId */
router.post("/itemidsucursal", isAuth, async (req, res) => {
  console.log('kardex get itemid_sucursal', req.body)
  const {sucursal, itemId} = req.body;
  
  const v_kardex = await Kardex.findOne({sucursal:sucursal,nombreId:itemId});
  if(v_kardex){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    res.send(v_kardex);
    //console.log('v_kardex',v_kardex)
  }else{
    res.status(404).send({ message: 'kardex no encontrados' });
    console.log('kardex No encontrado',v_kardex)
  }
});

/* Buscar todos los kardex de una sucursal con un nombre completo o parcial  */
router.post("/buscar", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {kardex,sucursal} = req.body
  const kardexes = await Kardex.find({ 'sucursal':sucursal,'nombre': { $regex: kardex, $options : "i"} }).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('Buscar kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('Buscar Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Kardexs no encontrados' });
    
  }
});

/* Obtener todos los kardex de una sucursal de un lote especifico, se puede poner el nombreI, nombre, etc
Tener cuidado con esta consulta */
router.post("/getsucursallote", isAuth, async (req, res) => {
  console.log('get users', req.body )
  const {lote,sucursal} = req.body

  const kardexes = await Kardex.find({ 'sucursal':sucursal,$or: lote }).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('getlote kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('getlote sucursal Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Kardexs no encontrados' });
    
  }
});

/* Actualizar los promedios de un lote de kardexs */
router.put("/uppromedio", isAuth, async (req, res) => {
  console.log('kardexs updatepromedio', req.body )
  
  const {nombre,sedes} = req.body
  const Oldkardex = await Kardex.findOne({kardexId:sedes[0].kardexId})
  await updateKardex(sedes)
  
  /* const v_kardexsPromedios = await sedes.map( async (se)=>{
    const v_manualSemana = se.manualSemana
    console.log('v_manualSemana',v_manualSemana);
    // Factores de reparticion Lu=0.1, Ma=0.1, Mi=0.1, Ju=0.11, Vi=0.15, Sa=0.21, Do=0.23
    const v_manualLunes = v_manualSemana * 0.1
    const v_manualMartes = v_manualSemana * 0.1
    const v_manualMiercoles = v_manualSemana * 0.1
    const v_manualJueves = v_manualSemana * 0.11
    const v_manualViernes = v_manualSemana * 0.15
    const v_manualSabado = v_manualSemana * 0.21
    const v_manualDomingo = v_manualSemana * 0.23
  
    const kardexes = await Kardex.updateOne({kardexId:se.kardexId},{$set:{'manualLunes':v_manualLunes,'manualMartes':v_manualMartes,'manualMiercoles':v_manualMiercoles,'manualJueves':v_manualJueves,'manualViernes':v_manualViernes,'manualSabado':v_manualSabado,'manualDomingo':v_manualDomingo,'manualSemana':v_manualSemana}})
    if(kardexes){
      console.log('realizado kardexes',kardexes);
      return  { kardexes}
    }else{
      console.log('No realizado kardexes',kardexes);
      return  { kardexes}
    }
  })
   */
  //console.log('respuesta',respuesta);
  if(Oldkardex){
    console.log('uppromedio respuesta',Oldkardex)
    res.send({
      _id:Oldkardex._id,
      kardexId:Oldkardex.kardexId,
      kardextipo:Oldkardex.kardextipo,
      nombre:Oldkardex.nombre,
      grupo:Oldkardex.grupo,
      familia:Oldkardex.familia,
      sucursal:Oldkardex.sucursal,
      stock:Oldkardex.stock,
      manualLunes:Oldkardex.manualLunes,
      manualMartes:Oldkardex.manualMartes,
      manualMiercoles:Oldkardex.manualMiercoles,
      manualJueves:Oldkardex.manualJueves,
      manualViernes:Oldkardex.manualViernes,
      manualSabado:Oldkardex.manualSabado,
      manualDomingo:Oldkardex.manualDomingo,
      manualSemana:Oldkardex.manualSemana,
      ultimoPrecio:Oldkardex.ultimoPrecio,
      stock:Oldkardex.stock,
    });
  }else{
    console.log('Kardexs no encontrados',   Oldkardex);
    res.status(404).send({ message: 'Kardexs no encontrados' });
  }
 
});

const updateKardex =  async (sedes) =>{
  var v_result = []

  sedes.forEach(async (se,i)=>{
   
    const oldkardex = await Kardex.findOne({ kardexId: se.kardexId})
    if (oldkardex) {
      const v_manualSemana = se.manualSemana
      //console.log('v_manualSemana',v_manualSemana);
      // Factores de reparticion Lu=0.1, Ma=0.1, Mi=0.1, Ju=0.11, Vi=0.15, Sa=0.21, Do=0.23
      const v_manualLunes = v_manualSemana * 0.1
      const v_manualMartes = v_manualSemana * 0.1
      const v_manualMiercoles = v_manualSemana * 0.1
      const v_manualJueves = v_manualSemana * 0.11
      const v_manualViernes = v_manualSemana * 0.15
      const v_manualSabado = v_manualSemana * 0.21
      const v_manualDomingo = v_manualSemana * 0.23

      oldkardex.manualLunes=v_manualLunes
      oldkardex.manualMartes=v_manualMartes
      oldkardex.manualMiercoles=v_manualMiercoles
      oldkardex.manualJueves=v_manualJueves
      oldkardex.manualViernes=v_manualViernes
      oldkardex.manualSabado=v_manualSabado
      oldkardex.manualDomingo=v_manualDomingo
      oldkardex.manualSemana=v_manualSemana
     
      const updatedKardex = await oldkardex.save();
      //res.send(updatedKardex)
      //console.log('Kardex updateKardex updatedKardex',updatedKardex)
    }else{
      console.log('Kardex NO updateKardex updatedKardex')
    }

  })
  
}

/* Obtener un lote de kardex */
router.post("/getlote", isAuth, async (req, res) => {
  //console.log('get users', req )
  const {lote} = req.body

  const kardexes = await Kardex.find({$or: lote }).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('getlote kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('getlote Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Kardexs no encontrados' });
    
  }
});

/* Obtener los kardex de una sucursal y por el grupo que pertenecen  */
router.post("/grupo", isAuth, async (req, res) => {
  console.log('get kardexs grupo', req.body )
  const {sucursal,grupo,kardextipo} = req.body
  const kardexes = await Kardex.find({ 'sucursal':sucursal,'grupo': grupo }).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('Grupo kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('Grupo Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Grupo de Kardexs no encontrados' });
    
  }
});

/* Obtener todos los kardex que pertenecen a un kardextipo, grupo y familia */
router.post("/allgrupo", isAuth, async (req, res) => {
  console.log('get kardexs allgrupo', req.body )
  const {grupo,familia,kardextipo} = req.body
  var v_camposFind = {}
  if(kardextipo){
    v_camposFind = {...v_camposFind,'kardextipo':kardextipo}    
  }
  if(grupo){
    v_camposFind = {...v_camposFind,'grupo':grupo}    
  }
  if(familia){
    v_camposFind = {...v_camposFind,'familia':familia}    
  }
  console.log('v_camposFind',v_camposFind);
  const kardexes = await Kardex.find(v_camposFind).sort({ "nombre": 1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('Grupo kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('Grupo Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Grupo de Kardexs no encontrados' });
    
  }
});

// Se obtiene el listado de kardex con sucursal y kardextipo
router.post("/tipo", isAuth, async (req, res) => {
  console.log('get kardexs tipo', req.body )
  const {sucursal,kardextipo} = req.body
  const kardexes = await Kardex.find({ 'sucursal':sucursal,'kardextipo': kardextipo }).sort({ "nombre": -1 }).limit(200);
  if(kardexes){
    //const users = usersf.filter(usuario=>usuario.sucursal === "todos").map ((user)=>({name:user.name}))
    //res.send(users);
    //console.log('Grupo kardexes',kardexes)
    res.send(kardexes);
  }else{
    console.log('Grupo Kardexs no encontrados',   kardexes);
    res.status(404).send({ message: 'Grupo de Kardexs no encontrados' });
    
  }
});

/* Registrar un kardex, esta funcion no se esta ejecutando en el proceso regular, ya que el kardex se crea automaticamente al crear un producto */
router.post('/registrar', async (req, res) => {
  console.log('Kardex registrar req.body ',req.body);
  const {kardextipo,nombre,sucursal,sucursalTipo,area,almacenId,unidadId,grupo,familia} = req.body
  if (nombre && sucursal && area) {
    const oldkardex = await Kardex.findOne({ nombre: nombre, sucursal: sucursal, area: area })
    if (oldkardex) {
      res.status(400).send({ message: 'Error: kardex ya existente.' });
    } else {
      const kardexId = await getSecuencia("Kardex");
      //console.log('kardexId',kardexId);
      const kardex = new Kardex({
        kardexId: kardexId,
        kardextipo: kardextipo,
        nombre: nombre,
        sucursal: sucursal,
        sucursalTipo: sucursalTipo,
        area: area,
        almacenId: almacenId,
        unidadId: unidadId,
        grupo: grupo,
        familia: familia,
      });
      const newKardex = await kardex.save();
      if (newKardex) {
        res.send({
          newKardex
        })
      } else {
        res.status(401).send({ message: 'Datos de kardex invalidos.' });
      }
    }

  } else {
    res.status(401).send({ message: 'Datos de kardex invalidos.' });
  }
});

/* Regitrar el consumo manual de un kardex especifico kardexId */
router.post('/regconsumo', async (req, res) => {
  console.log('Kardex regconsumo req.body ',req.body);
  const {kardexId,isAutoProcess,manualLunes,manualMartes,manualMiercoles,manualJueves,manualViernes,
    manualSabado,manualDomingo,manualSemana} = req.body
  if (kardexId ) {
    const oldkardex = await Kardex.findOne({ kardexId: kardexId})
    if (oldkardex) {
      oldkardex.isAutoProcess=isAutoProcess
      oldkardex.manualLunes=manualLunes
      oldkardex.manualMartes=manualMartes
      oldkardex.manualMiercoles=manualMiercoles
      oldkardex.manualJueves=manualJueves
      oldkardex.manualViernes=manualViernes
      oldkardex.manualSabado=manualSabado
      oldkardex.manualDomingo=manualDomingo
      oldkardex.manualSemana=manualSemana
     
      const updatedKardex = await oldkardex.save();
      res.send(updatedKardex)
      console.log('Kardex regconsumo updatedKardex',updatedKardex)
    } else {
      
      res.status(401).send({ message: 'KardexId No existe.' });
      console.log('KardexId No existe.',kardexId)
    }
  }
});

/* Regitrar el stock manualmente de un kardex especifico kardexId */
router.put('/regstock', async (req, res) => {
  console.log('Kardex regstock req.body ',req.body);
  const {kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio} = req.body
  if (kardexId ) {
    const oldkardex = await Kardex.findOne({ kardexId: kardexId})
    if (oldkardex) {
      const v_oldStock = oldkardex.stock
        
      console.log('v_oldStock',v_oldStock);
      oldkardex.stock=stock
      const updatedKardex = await oldkardex.save();

      const v_resp1 = registrarKardexDet(kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio)
      if (updatedKardex) {
        res.send(updatedKardex)
        console.log('Exitosa creacion de updatedKardex',updatedKardex);
      } else {
        res.status(401).send({ message: 'Error : No se pudo grabar el kardex.' });
        console.log('Error en creacion de newKardexDet',updatedKardex);
      }
      
    }
  }
});

const registrarKardexDet =  async (kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio) =>{
   
  const oldkardexDet = await Kardexdet.find({ kardexId: kardexId}).find().sort({$natural:-1}).limit(1);
  console.log('oldkardexDet',oldkardexDet);
  const kardexDetId = await getSecuencia("Kardexdetalle");
  console.log('kardexDetId',kardexDetId);
  if (oldkardexDet.length>0) {
    console.log('Tiene registro de apertura',oldkardexDet,kardexDetId);
    var v_resp = await saveKardexDet(kardexDetId,kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio,oldkardexDet[0])
  }else {
    // No tiene ningun registro, no tiene registro de apertura, se va crear el primer registro
    console.log('No tiene registro de apertura',oldkardexDet,kardexDetId);
    var v_resp = await saveAperturaKardexDet(kardexDetId,kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio,oldkardexDet[0])
  }
  return v_resp
}

const saveKardexDet =  async (kardexDetId,kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio,oldkardexDet) =>{
  console.log('oldkardexDet',oldkardexDet);
  const Total = stockDet * Precio
  const fecha = moment().format("YYYY-MM-DD")
   
  const v_saldoCantidad = oldkardexDet.saldoCantidad
  const v_saldoPrecio = oldkardexDet.saldoPrecio
  const v_saldoTotal = oldkardexDet.saldoTotal
  console.log('oldkardex',v_saldoCantidad,v_saldoPrecio,v_saldoTotal);
  if(isIngreso){
    // Es ingreso de Kardex detallado
    console.log('oldkardexDet Es ingreso:',oldkardexDet);
    var v_newSaldoTotal = v_saldoTotal + Total
    var v_newSaldoCantidad = v_saldoCantidad + stockDet
    if(v_newSaldoCantidad === 0){
      var v_newSaldoPrecio = v_saldoPrecio
    }else{
      var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    console.log('newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: stockModifyNombre,
      ingresoCantidad: stockDet,
      ingresoPrecio: Precio,
      ingresoTotal: Total,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
    });

  }else{
    // Es salida de Kardex detallado
    console.log('oldkardexDet Es ingreso:',oldkardexDet);
    var v_newSaldoTotal = v_saldoTotal - Total
    var v_newSaldoCantidad = v_saldoCantidad - stockDet
    if(v_newSaldoCantidad === 0){
      var v_newSaldoPrecio = v_saldoPrecio
    }else{
      var v_newSaldoPrecio = v_newSaldoTotal / v_newSaldoCantidad
    }
    console.log('newkardexDet',v_newSaldoTotal,v_newSaldoCantidad,v_newSaldoPrecio);
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: stockModifyNombre,
      salidaCantidad: stockDet,
      salidaPrecio: Precio,
      salidaTotal: Total,
      saldoCantidad: v_newSaldoCantidad,
      saldoPrecio: v_newSaldoPrecio,
      saldoTotal: v_newSaldoTotal,
    });
  }
  const newKardexDet = await kardexDet.save();
  if (newKardexDet) {
    //res.send(newKardexDet)
    console.log('Exitosa creacion de newKardexDet',newKardexDet); 
  } else {
    //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
    console.log('Error en creacion de newKardexDet',newKardexDet);
  }
  return newKardexDet
}


const saveAperturaKardexDet =  async (kardexDetId,kardexId,stock,stockDet,isIngreso,stockModifyNombre,Precio,oldkardexDet) =>{
  const Total = stockDet * Precio
  const fecha = moment().format("YYYY-MM-DD")
   
  if(isIngreso){
    console.log('No tiene registro de apertura - es INGRESO',Total,kardexId,kardexDetId,stockDet,Precio);
    // Es primer registro de Ingreso
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: stockModifyNombre,
      ingresoCantidad: stockDet,
      ingresoPrecio: Precio,
      ingresoTotal: Total,
      saldoCantidad: stockDet,
      saldoPrecio: Precio,
      saldoTotal: Total,
    });
  }else{
    console.log('No tiene registro de apertura - es SALIDA');
    // Es primer registro de Salida, salida sin ingreso, es negativo
    var kardexDet = new Kardexdet({
      kardexId: kardexId,
      kardexDetId: kardexDetId,
      fecha: fecha,
      descripcion: stockModifyNombre,
      salidaCantidad: stockDet,
      salidaPrecio: Precio,
      salidaTotal: Total,
      saldoCantidad: -stockDet,
      saldoPrecio: Precio,
      saldoTotal: -Total,
    });
  }
  const newKardexDet = await kardexDet.save();
  if (newKardexDet) {
    //res.send(newKardexDet)
    console.log('Exitosa creacion de newKardexDet',newKardexDet); 
  } else {
    //res.status(401).send({ message: 'Error : No se pudo grabar el kardex Detalle.' });
    console.log('Error en creacion de newKardexDet',newKardexDet);
  }
  return newKardexDet
}

/* Funcion que registra una porcion en el kardex */
router.post('/regporcion', async (req, res) => {
  console.log('Kardex registrar req.body ',req.body);
  const {kardextipo,nombre,sucursal,sucursalTipo,area,almacenId,unidadId,grupo} = req.body
  if(kardextipo === 'Porcion'){

    if (nombre && sucursal && area) {
      const oldkardex = await Kardex.findOne({ nombre: nombre, sucursal: sucursal, area: area })
      if (oldkardex) {
        res.status(400).send({ message: 'Error: kardex ya existente.' });
      } else {
        const kardexId = await getSecuencia("Kardex");
        console.log('kardexId',kardexId);
        const kardex = new Kardex({
          kardexId: kardexId,
          kardextipo: kardextipo,
          nombre: nombre,
          sucursal: sucursal,
          sucursalTipo: sucursalTipo,
          area: area,
          almacenId: almacenId,
          unidadId: unidadId,
          grupo: grupo,
        });
        const newKardex = await kardex.save();
        if (newKardex) {
          res.send({
            newKardex
          })
        } else {
          res.status(401).send({ message: 'Datos de kardex invalidos.' });
        }
      }
  
    } else {
      res.status(401).send({ message: 'Datos de kardex invalidos.' });
    }
  }
});


module.exports = router;