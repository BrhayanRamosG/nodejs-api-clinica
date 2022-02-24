//const { Router } = require("express");
const express = require('express')
const mysql = require('../conexion')
const router = express.Router()
const fs = require('fs')
//const router = Router();

const webpush = require("../webpush");
let pushSubscripton;

router.post("/api/subscription/:idCita", async (req, res) => {
    pushSubscripton = req.body;
    let data = { //JSON
        token: JSON.stringify(pushSubscripton), //JSON.stringify(pushSubscripton),
        Cita_idCita: req.params.idCita
    }
    let sql = "INSERT INTO notificacion SET ?"
    mysql.query(sql, data, async (error, results) => {
        if (error) {
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(201).send({
                estado: "Ok",
                datos: results,
            });
        }
    })
    //console.log(pushSubscripton);
    //let data = JSON.stringify(pushSubscripton)

    // Server's Response
    //res.status(201).json();
});

router.post("/api/subscription-medico/:idMedico", async (req, res) => {
    pushSubscripton = req.body;
    let data = { //JSON
        token: JSON.stringify(pushSubscripton), //JSON.stringify(pushSubscripton),
        Medico_idMedico: req.params.idMedico
    }

    let sql = "INSERT INTO notificacionmedico SET ?"
    mysql.query(sql, data, async (error, results) => {
        if (error) {
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(201).send({
                estado: "Ok",
                datos: results,
            });
        }
    })
});


router.post("/api/new-message/:idCita", async (req, res) => {
    //const { message } = req.body;
    let sql = "SELECT cita.*,notificacion.token,medico.nombreMedico,medico.apellidosMedico,medico.precioConsulta,enfermedad.nombreEnfermedad,DATE_FORMAT(cita.fecha,'%d/%m/%Y %H:%i') AS FechaF,foto.img FROM cita INNER JOIN notificacion ON cita.idCita = notificacion.Cita_idCita INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad INNER JOIN foto ON medico.Foto_idFoto = foto.idFoto WHERE cita.estado = 1 AND notificacion.Cita_idCita = ?";
    mysql.query(sql, [req.params.idCita], async (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
            // Payload Notification
            const payload = JSON.stringify({
                title: "Cita agendada exitosamente",
                message: `Médico: ${results[0]?.nombreMedico} ${results[0]?.apellidosMedico}\nFecha cita: ${results[0]?.FechaF} h\nPrecio consulta: $${results[0]?.precioConsulta} MXN \nEnfermedad: ${results[0]?.nombreEnfermedad}`,
                foto: `http://192.168.1.69:8085/medicosImagenes/${results[0]?.img}`
            });

            //res.status(200).json();
            try {
                await webpush.sendNotification(JSON.parse(results[0]?.token), payload);
            } catch (error) {
                console.log(error);
            }
        }
    })
});


router.post("/api/new-message-fail/:idCita", async (req, res) => {
    //const { message } = req.body;
    let sql = "SELECT cita.*,notificacion.token,medico.nombreMedico,medico.precioConsulta FROM cita INNER JOIN notificacion ON cita.idCita = notificacion.Cita_idCita INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico WHERE cita.estado = 2 AND notificacion.Cita_idCita = ?";
    mysql.query(sql, [req.params.idCita], async (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
            // Payload Notification
            const payload = JSON.stringify({
                title: "Tu cita fue denegada",
                message: `Realiza otra solicitud o ve a tu clinica más cercana para más información`,
                foto: `http://192.168.1.69:8085/medicosImagenes/error.png`
            });
            //res.status(200).json();
            try {
                await webpush.sendNotification(JSON.parse(results[0]?.token), payload);
            } catch (error) {
                console.log(error);
            }
        }
    })
});

router.post("/api/new-message-edit/:idCita", async (req, res) => {
    //const { message } = req.body;
    let sql = "SELECT cita.*,notificacion.token,medico.nombreMedico,medico.apellidosMedico,medico.precioConsulta,enfermedad.nombreEnfermedad,DATE_FORMAT(cita.fecha,'%d/%m/%Y %H:%i') AS FechaF,foto.img FROM cita INNER JOIN notificacion ON cita.idCita = notificacion.Cita_idCita INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad INNER JOIN foto ON medico.Foto_idFoto = foto.idFoto WHERE cita.estado = 1 AND notificacion.Cita_idCita = ?";
    mysql.query(sql, [req.params.idCita], async (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
            // Payload Notification
            const payload = JSON.stringify({
                title: "Cita agendada con cambio de fecha u horario",
                message: `Médico: ${results[0]?.nombreMedico} ${results[0]?.apellidosMedico}\nFecha cita: ${results[0]?.FechaF} h\nPrecio consulta: $${results[0]?.precioConsulta} MXN \nEnfermedad: ${results[0]?.nombreEnfermedad}`,
                foto: `http://192.168.1.69:8085/medicosImagenes/${results[0]?.img}`
            });
            //res.status(200).json();
            try {
                await webpush.sendNotification(JSON.parse(results[0]?.token), payload);
            } catch (error) {
                console.log(error);
            }
        }
    })
});

router.post("/api/new-message-medico/:idMedico/:idCita", async (req, res) => {
    //const { message } = req.body;
    let sql = "SELECT cita.*,enfermedad.nombreEnfermedad,DATE_FORMAT( cita.fecha, '%d/%m/%Y %H:%i' ) AS FechaF,( SELECT notificacionmedico.token FROM notificacionmedico WHERE notificacionmedico.Medico_idMedico = ? ORDER BY idNotificacionMedico DESC LIMIT 1 ) AS token,paciente.nombrePaciente,paciente.apellidosPaciente,foto.img FROM cita INNER JOIN enfermedad ON cita.Enfermedad_idEnfermedad = enfermedad.idEnfermedad INNER JOIN paciente ON cita.Paciente_idPaciente = paciente.idPaciente INNER JOIN medico ON cita.Medico_idMedico = medico.idMedico INNER JOIN foto ON paciente.Foto_idFoto = foto.idFoto WHERE cita.estado = 0 AND cita.idCita = ?";
    mysql.query(sql, [req.params.idMedico, req.params.idCita], async (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
            // Payload Notification
            const payload = JSON.stringify({
                title: "Nueva solicitud de cita",
                message: `Paciente: ${results[0]?.nombrePaciente} ${results[0]?.apellidosPaciente}\nFecha cita: ${results[0]?.FechaF} h\nEnfermedad: ${results[0]?.nombreEnfermedad}`,
                foto: `http://192.168.1.69:8085/medicosImagenes/${results[0]?.img}`
            });

            //res.status(200).json();
            try {
                await webpush.sendNotification(JSON.parse(results[0]?.token), payload);
            } catch (error) {
                console.log(error);
            }
        }
    })
});

module.exports = router;