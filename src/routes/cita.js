const express = require('express')
const router = express.Router()
const mysql = require('../conexion')
const sign = require('jwt-encode');

router.get('/api/citas/:idMedico', function (req, res) {
    let sql = "SELECT cita.*,paciente.*,enfermedad.*,DATE_FORMAT( cita.fecha, '%Y-%m-%dT%H:%i:%s' ) AS FechaCita,DATE_FORMAT( cita.fecha, '%d/%m/%Y %H:%i:%s' ) AS FechaCitaTabla,medico.precioConsulta,tratamiento.precio AS precioTratamiento,tratamiento.idTratamiento FROM cita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN tratamiento ON enfermedad.idEnfermedad = tratamiento.Enfermedad_idEnfermedad WHERE medico.idMedico = ? ORDER BY cita.fecha";
    mysql.query(sql, [req.params.idMedico], (error, results) => {
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

router.get('/api/citas-paciente/:idPaciente', function (req, res) {
    let sql = "SELECT cita.*,paciente.*,enfermedad.*,DATE_FORMAT( cita.fecha, '%Y-%m-%dT%H:%i:%s' ) AS FechaCita,DATE_FORMAT( cita.fecha, '%d/%m/%Y %H:%i:%s' ) AS FechaCitaTabla,medico.precioConsulta,tratamiento.precio AS precioTratamiento,medico.nombreMedico, medico.apellidosMedico FROM cita INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN tratamiento ON enfermedad.idEnfermedad = tratamiento.Enfermedad_idEnfermedad WHERE paciente.idPaciente = ? ORDER BY cita.fecha";
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

router.post('/api/registro-cita', (req, res) => { //Registrar paciente
    let data = { //JSON
        fecha: req.body.fecha,
        Medico_idMedico: req.body.Medico_idMedico,
        Paciente_idPaciente: req.body.Paciente_idPaciente,
        Enfermedad_idEnfermedad: req.body.Enfermedad_idEnfermedad
    }
    let sql = "INSERT INTO cita SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar la cita" });
        } else {
            const token = sign(results, "secret");
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrar cita", token: token, idCitaInsertada: results.insertId });
        }
    })
});

router.put('/api/edit_cita/:idCita', (req, res) => { //Editar salario empleado
    let data = { //JSON
        estado: req.body.estado
    };
    mysql.query('UPDATE cita SET ? WHERE idCita= ?', [data, req.params.idCita], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Cita actualizada con éxito"
            });
        }
    })
});

router.put('/api/edit_cita_fecha/:idCita', (req, res) => { //Editar salario empleado
    let data = { //JSON
        estado: req.body.estado,
        fecha: req.body.fecha
    };
    mysql.query('UPDATE cita SET ? WHERE idCita= ?', [data, req.params.idCita], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Cita actualizada con éxito"
            });
        }
    })
});

module.exports = router