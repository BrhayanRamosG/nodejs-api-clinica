require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const path = require('path')
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.static(path.join(__dirname, "imagenes")));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
//app.use(express(path.join(__dirname, "/imagenes/")));
app.use(require('./routes/login'))
app.use(require('./routes/paciente'))
app.use(require('./routes/enfermedad'))
app.use(require('./routes/medico'))
app.use(require('./routes/multimedia'))
app.use(require('./routes/notificaciones'))
app.use(require('./routes/gasto'))
app.use(require('./routes/cita'))

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`Servidor Ok en puerto ${PORT}.`);
});