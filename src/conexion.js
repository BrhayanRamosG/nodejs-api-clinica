const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbclinica'
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('CONEXIÓN EXITOSA A BD')
    }
});

module.exports = conexion