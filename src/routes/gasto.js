const express = require('express')
const router = express.Router()
const mysql = require('../conexion')

router.get('/api/gastos/:idPaciente', function (req, res) {
    let sql = "SELECT factura.*,detalle_cita.cantidad,detalle_cita.precio,DATE_FORMAT( cita.fecha, '%d/%m/%Y %H:%i' ) AS fechaCita,DATE_FORMAT( factura.fecha, '%d/%m/%Y' ) AS fechaFactura,cita.estado,paciente.nombrePaciente,paciente.apellidosPaciente,medico.nombreMedico,medico.apellidosMedico FROM factura INNER JOIN detalle_cita ON factura.idFactura = detalle_cita.Factura_idFactura INNER JOIN cita ON detalle_cita.Cita_idCita = cita.idCita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico WHERE paciente.idPaciente = ? AND cita.estado = 1 ORDER BY factura.idFactura ASC";
    mysql.query(sql, [req.params.idPaciente], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results
            });
        }
    })
});

router.get('/api/gastos-tratamiento/:idPaciente', function (req, res) {
    let sql = "SELECT factura.*,DATE_FORMAT( factura.fecha, '%d/%m/%Y' ) AS fechaFactura,detalle_tratamiento.precio,cita.idCita,DATE_FORMAT( cita.fecha, '%d/%m/%Y %H:%i' ) AS fechaCita,tratamiento.precio AS precioTratamiento,medico.nombreMedico,medico.apellidosMedico,paciente.nombrePaciente,paciente.apellidosPaciente,enfermedad.nombreEnfermedad FROM factura INNER JOIN detalle_tratamiento ON factura.idFactura = detalle_tratamiento.Factura_idFactura INNER JOIN tratamiento ON detalle_tratamiento.Tratamiento_idTratamiento = tratamiento.idTratamiento INNER JOIN cita ON detalle_tratamiento.Cita_idCita = cita.idCita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad AND tratamiento.Enfermedad_idEnfermedad = enfermedad.idEnfermedad WHERE paciente.idPaciente = ? AND cita.estado = 1 ORDER BY factura.idFactura ASC";
    mysql.query(sql, [req.params.idPaciente], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results
            });
        }
    })
});

router.get('/api/total-consulta/:idPaciente', function (req, res) {
    let sql = "SELECT SUM( ROUND( detalle_cita.precio, 2 ) ) AS Total FROM factura INNER JOIN detalle_cita ON factura.idFactura = detalle_cita.Factura_idFactura INNER JOIN cita ON detalle_cita.Cita_idCita = cita.idCita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico WHERE paciente.idPaciente = ?";
    mysql.query(sql, [req.params.idPaciente], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results
            });
        }
    })
});

router.get('/api/total-tratamiento/:idPaciente', function (req, res) {
    let sql = "SELECT SUM( ROUND(detalle_tratamiento.precio,2) ) AS Total FROM factura INNER JOIN detalle_tratamiento ON factura.idFactura = detalle_tratamiento.Factura_idFactura INNER JOIN tratamiento ON detalle_tratamiento.Tratamiento_idTratamiento = tratamiento.idTratamiento INNER JOIN cita ON detalle_tratamiento.Cita_idCita = cita.idCita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico WHERE paciente.idPaciente = ? AND cita.estado = 1";
    mysql.query(sql, [req.params.idPaciente], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results
            });
        }
    })
});

router.post('/api/registro-detalle-cita', (req, res) => { //Registrar paciente
    let data = { //JSON
        Cita_idCita: req.body.Cita_idCita,
        Factura_idFactura: req.body.Factura_idFactura,
        cantidad: 1,
        precio: req.body.precio
    }
    let sql = "INSERT INTO detalle_cita SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar detalle de la cita" });
        } else {
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrar detalle cita", idDetalleCitaInsertada: results.insertId });
        }
    })
});

router.post('/api/registro-detalle-tratamiento', (req, res) => { //Registrar paciente
    let data = { //JSON
        Tratamiento_idTratamiento: req.body.Tratamiento_idTratamiento,
        Factura_idFactura: req.body.Factura_idFactura,
        cantidad: 1,
        precio: req.body.precio,
        Cita_idCita: req.body.Cita_idCita
    }
    let sql = "INSERT INTO detalle_tratamiento SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar detalle tratamiento" });
        } else {
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrar detalle tratamiento", idDetalleTratamientoInsertado: results.insertId });
        }
    })
});

router.post('/api/registro-factura', (req, res) => { //Registrar paciente
    let today = new Date();
    let fechaHoy = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    let data = { //JSON
        fecha: fechaHoy
    }
    let sql = "INSERT INTO factura SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar factura" });
        } else {
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrar factura", idFacturaInsertada: results.insertId });
        }
    })
});

module.exports = router