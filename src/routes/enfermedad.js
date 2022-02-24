const express = require('express')
const router = express.Router()
const mysql = require('../conexion')

router.get('/api/tratamiento-enfermedad', function (req, res) {
    let sql = "SELECT enfermedad.*,tratamiento.* FROM enfermedad INNER JOIN tratamiento ON enfermedad.idEnfermedad = tratamiento.Enfermedad_idEnfermedad";
    mysql.query(sql, (error, results) => {
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

router.get('/api/tratamiento-enfermedad-info/:idEnfermedad', function (req, res) {
    let sql = "SELECT enfermedad.*,tratamiento.* FROM enfermedad INNER JOIN tratamiento ON enfermedad.idEnfermedad = tratamiento.Enfermedad_idEnfermedad WHERE tratamiento.idTratamiento=?";
    mysql.query(sql, [req.params.idEnfermedad], (error, results) => {
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

router.get('/api/enfermedad-especialidad/:idEspecialidad', function (req, res) {
    let sql = "SELECT * FROM especialidad INNER JOIN enfermedad ON especialidad.idEspecialidad = enfermedad.Especialidad_idEspecialidad WHERE especialidad.idEspecialidad = ?";
    mysql.query(sql, [req.params.idEspecialidad], (error, results) => {
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

module.exports = router