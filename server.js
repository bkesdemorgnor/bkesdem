var express = require('express');
const multer = require('multer');
const path = require('path');
//const uuid = require('uuidv4');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const dotenv = require('dotenv');

const userRoute = require('./routes/userRoute');
const perfilRoute = require('./routes/perfilRoute');
const sucursalRoute = require('./routes/sucursalRoute');
const sucursalTipoRoute = require('./routes/sucursalTipoRoute');
const productoRoute = require('./routes/productoRoute');
const formulaRoute = require('./routes/formulaRoute');
const formuladetalleRoute = require('./routes/formulaDetRoute');
const porcionRoute = require('./routes/porcionRoute');

const repartidorPorRoute = require('./routes/repartidorPorRoute');
const repartidorPorDetRoute = require('./routes/repartidorPorDetRoute');
const repartePorSolRoute = require('./routes/repartePorSolRoute');

const repartidorUndRoute = require('./routes/repartidorUndRoute');
const repartidorUndDetRoute = require('./routes/repartidorUndDetRoute');
const reparteUndSolRoute = require('./routes/reparteUndSolRoute');

const porciondetalleRoute = require('./routes/porcionDetRoute');
const pedformRoute = require('./routes/pedformRoute');
const pedformdetalleRoute = require('./routes/pedformDetRoute');
const proveedorRoute = require('./routes/proveedorRoute');
const familiaRoute = require('./routes/familiaRoute');
const unidadRoute = require('./routes/unidadRoute');
const stockModifyRoute = require('./routes/stockModifyRoute');
const productoTipoRoute = require('./routes/productoTipoRoute');
const kardexRoute = require('./routes/kardexRoute');
const kardexDetRoute = require('./routes/kardexDetRoute');
const kardexTipoRoute = require('./routes/kardexTipoRoute');
const almacenRoute = require('./routes/almacenRoute');
const areaRoute = require('./routes/areaRoute');
const cociareaRoute = require('./routes/cociareaRoute');
const grupoRoute = require('./routes/grupoRoute');
const ingredienteRoute = require('./routes/ingredienteRoute');
const ingredientedetalleRoute = require('./routes/ingredienteDetRoute');
const convUnidadRoute = require('./routes/convUnidadRoute');
const pedidoRoute = require('./routes/pedidoRoute');
const pedidodetalleRoute = require('./routes/pedidoDetRoute');
const ventaRoute = require('./routes/ventaRoute');
const recetaRoute = require('./routes/recetaRoute');
const recetaDetRoute = require('./routes/recetaDetRoute');
const cartaRoute = require('./routes/cartaRoute');
const choferRoute = require('./routes/choferRoute');
const guiaRemisionRoute = require('./routes/guiaRemisionRoute');
const categoriaRoute = require('./routes/categoriaRoute');
const cecomercialRoute = require('./routes/cecomercialRoute');
const proveedorproductosRoute = require('./routes/proveedorProdRoute');
const ordencompraRoute = require('./routes/ordenCompraRoute');
const tipounidadesRoute = require('./routes/unidadesRoute');
const unidadesdetalleRoute = require('./routes/unidadesDetRoute');
const diarioAlmacenRoute = require('./routes/diarioAlmacenRoute');
const cuentaRoute = require('./routes/cuentaRoute');
const transporteRoute = require('./routes/transporteRoute');
const tipoOperacionRoute = require('./routes/tipoOperacionRoute');
const pagoProveedorRoute = require('./routes/pagoProveedorRoute');
const ingresoGastoTipoRoute = require('./routes/ingresoGastoTipoRoute');
const ingresoGastoRoute = require('./routes/ingresoGastoRoute');
const notificacionRoute = require('./routes/notificacionRoute');
const transferSolRoute = require('./routes/transferSolRoute');


const cors = require('cors');
const { log } = require('console');
var app = express();
//const app = require('express')();
//const server = require("http").Server(app);
var server = require("http").Server(app);


dotenv.config();

const mongodbUrl = config.MONGODB_URL;
console.log("mongodbUrl",mongodbUrl);
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(db =>console.log("Database is connected"))
.catch((error) => console.log("Mongose no se conecto",error.reason));



app.use(cors());
app.use(bodyParser.json());


app.use('/api/users', userRoute);
app.use('/api/perfiles', perfilRoute);
app.use('/api/sucursales', sucursalRoute);
app.use('/api/sucursalTipos', sucursalTipoRoute);
app.use('/api/productos', productoRoute);
app.use('/api/formulas', formulaRoute);
app.use('/api/formuladetalles', formuladetalleRoute);

app.use('/api/repartidorporciones', repartidorPorRoute);
app.use('/api/repartidorpordets', repartidorPorDetRoute);
app.use('/api/reparteporsols', repartePorSolRoute);

app.use('/api/repartidorunidades', repartidorUndRoute);
app.use('/api/repartidorunddets', repartidorUndDetRoute);
app.use('/api/reparteundsols', reparteUndSolRoute);

app.use('/api/porciones', porcionRoute);
app.use('/api/porciondetalles', porciondetalleRoute);
app.use('/api/pedforms', pedformRoute);
app.use('/api/pedformdetalles', pedformdetalleRoute);
app.use('/api/proveedores', proveedorRoute);
app.use('/api/familias', familiaRoute);
app.use('/api/unidades', unidadRoute);
app.use('/api/stockmodifys', stockModifyRoute);
app.use('/api/productoTipos', productoTipoRoute);
app.use('/api/kardexs', kardexRoute);
app.use('/api/kardexdets', kardexDetRoute);
app.use('/api/kardextipos', kardexTipoRoute);
app.use('/api/almacenes', almacenRoute);
app.use('/api/areas', areaRoute);
app.use('/api/cociareas', cociareaRoute);
app.use('/api/grupos', grupoRoute);
app.use('/api/ingredientes', ingredienteRoute);
app.use('/api/ingredientedetalles', ingredientedetalleRoute);
app.use('/api/convunidades', convUnidadRoute);
app.use('/api/pedidos', pedidoRoute);
app.use('/api/pedidodetalles', pedidodetalleRoute);
app.use('/api/ventas', ventaRoute);
app.use('/api/recetas', recetaRoute);
app.use('/api/recetadetalles', recetaDetRoute);
app.use('/api/cartas', cartaRoute);
app.use('/api/choferes', choferRoute);
app.use('/api/guiasremision', guiaRemisionRoute);
app.use('/api/categorias', categoriaRoute);
app.use('/api/cecomerciales', cecomercialRoute);
app.use('/api/proveedorproductos', proveedorproductosRoute);
app.use('/api/ordencompras', ordencompraRoute);
app.use('/api/tipounidades', tipounidadesRoute);
app.use('/api/unidadesdetalles', unidadesdetalleRoute);
app.use('/api/diarioalmacen', diarioAlmacenRoute);
app.use('/api/cuentas', cuentaRoute);
app.use('/api/transportes', transporteRoute);
app.use('/api/tipooperaciones', tipoOperacionRoute);
app.use('/api/pagoproveedores', pagoProveedorRoute);
app.use('/api/ingresogastos', ingresoGastoRoute);
app.use('/api/ingresogastotipos', ingresoGastoTipoRoute);
app.use('/api/notificaciones', notificacionRoute);
app.use('/api/transfersols', transferSolRoute);



//app.use(express.static(path.join(__dirname, '/../frontend/build')));
/* app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
}); */

// Routing
app.use(express.static(path.join(__dirname, 'public')));


//app.listen(config.PORT, () => { console.log('Server started at http://localhost:5000'); });
//app.listen(config.PORT, () => { console.log('Server started at ',config.PORT); });
server.listen(config.PORT, () => { console.log('Server started at ',config.PORT); });

// Export the Express API
module.exports = app;
