const express = require('express')
const mysql = require('../conexion')
const router = express.Router()
const sign = require('jwt-encode');

function calcularEdad(birthday) {
    birthday = new Date(birthday.split('/').reverse().join('-'));
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

router.get('/api/medicos', function (req, res) {
    let sql = "SELECT medico.*,especialidad.nombreEspecialidad,foto.img FROM medico INNER JOIN especialidad ON medico.Especialidad_idEspecialidad = especialidad.idEspecialidad INNER JOIN foto ON medico.Foto_idFoto = foto.idFoto ORDER BY medico.idMedico";
    mysql.query(sql, [req.params.usuario], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
        }
    })
});

router.get('/api/medicos-info', function (req, res) {
    let sql = "SELECT medico.*,especialidad.nombreEspecialidad,foto.img FROM medico INNER JOIN especialidad ON medico.Especialidad_idEspecialidad = especialidad.idEspecialidad INNER JOIN foto ON medico.Foto_idFoto = foto.idFoto ORDER BY medico.idMedico";
    mysql.query(sql, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
        }
    })
});

router.get('/api/horarios-medicos', function (req, res) {
    let sql = "SELECT dialaboral.*,horarios.*,TIME_FORMAT( horarios.horaInicio, '%H:%i' ) AS Inicio,TIME_FORMAT( horarios.horaFin, '%H:%i' ) AS Fin,TIME_FORMAT( horarios.horaInicio, '%H' ) AS InicioC,TIME_FORMAT( horarios.horaFin, '%H' ) AS FinC,TIME_FORMAT( horarios.horaInicio, '%i' ) AS mInicioC,TIME_FORMAT( horarios.horaFin, '%i' ) AS mFinC FROM dialaboral INNER JOIN horarios ON dialaboral.idDiaLaboral = horarios.DiaLaboral_idDiaLaboral ORDER BY dialaboral.idDiaLaboral";
    mysql.query(sql, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            res.status(200).send({
                estado: "Ok",
                datos: results,
            });
        }
    })
});


router.post('/api/registro-medico', (req, res) => { //Registrar paciente
    let data = { //JSON
        nombreMedico: req.body.nombre,
        apellidosMedico: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        sexo: req.body.sexo,
        edad: calcularEdad(req.body.fechaNacimiento),
        telefono: req.body.telefono,
        precioConsulta: req.body.precioConsulta,
        Espcialidad_idEspecialidad: req.body.especialidad,
        Login_idLogin: req.body.idLogin,
        Foto_idFoto: req.body.idFoto
    }
    let sql = "INSERT INTO medico SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar" });
        } else {
            const token = sign(results, "secret");
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrarse", token: token, idMedicoInsertado: results.insertId });
        }
    })
});

router.post('/api/registro_salario_empleado', (req, res) => { //Crear salario empleado
    let data = { //JSON
        valor: req.body.valor,
        bonus: req.body.bonus,
        aguinaldo: req.body.aguinaldo,
        Empleado_idEmpleado: req.body.Empleado_idEmpleado
    };
    let sql = "INSERT INTO salario SET ? ";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Salario registrado con éxito"
            });
        }
    })
});

router.put('/api/edit_salario_empleado/:id', (req, res) => { //Editar salario empleado
    let data = { //JSON
        valor: req.body.valor,
        bonus: req.body.bonus,
        aguinaldo: req.body.aguinaldo
    };
    mysql.query('UPDATE salario SET ? WHERE idSalario= ?', [data, req.params.id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Salario actualizado con éxito"
            });
        }
    })
});

router.delete('/api/delete_salario/:id', (req, res) => { //Borrar salario
    mysql.query('DELETE FROM salario WHERE idSalario = ?', [req.params.id], (error) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Salario eliminado con éxito"
            });
        }
    })
});
module.exports = router