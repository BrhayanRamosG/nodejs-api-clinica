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

router.post('/api/registro-paciente', (req, res) => { //Registrar paciente
    let data = { //JSON
        nombrePaciente: req.body.nombre,
        apellidosPaciente: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        sexo: req.body.sexo,
        edad: calcularEdad(req.body.fechaNacimiento),
        telefono: req.body.telefono,
        Login_idLogin: req.body.idLogin,
        curp: req.body.curp,
        Foto_idFoto: req.body.idFoto
    }
    let sql = "INSERT INTO paciente SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar" });
        } else {
            const token = sign(results, "secret");
            res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrarse", token: token, idPacienteInsertado: results.insertId });
        }
    })
});

router.put('/api/edit-paciente-telefono/:id', (req, res) => { //Editar salario empleado
    let data = { //JSON
        telefono: req.body.telefono
    };
    mysql.query('UPDATE paciente SET ? WHERE idPaciente= ?', [data, req.params.id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(201).send({
                code: 201,
                msg: "Telefono actualizado con éxito"
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