const express = require('express')
const router = express.Router()
const mysql = require('../conexion')
const md5 = require('md5');
const sign = require('jwt-encode');

router.get('/api/usuario/:usuario?', function (req, res) {
    let sql = "SELECT user FROM login WHERE user = ?";
    mysql.query(sql, [req.params.usuario], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            if (results != "") {
                res.status(200).send({
                    estado: "Ok",
                    datos: results,
                    msg: "Exito, este usuario ya está registrado"
                });
            } else {
                res.status(204).send({
                    code: 204,
                    estado: "Error",
                    msg: "Error, revise sus credenciales"
                });
            }
        }
    })
});

router.get('/api/email/:email?', function (req, res) {
    let sql = "SELECT email FROM login WHERE email = ?";
    mysql.query(sql, [req.params.email], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ status: "Error", data: results });
        } else {
            if (results != "") {
                res.status(200).send({
                    estado: "Ok",
                    datos: results,
                    msg: "Exito, este email ya está registrado"
                });
            } else {
                res.status(204).send({
                    code: 204,
                    estado: "Error",
                    msg: "Error, revise sus credenciales"
                });
            }
        }
    })
});

router.post('/api/login-paciente', (req, res) => { //Login usuario
    let data = { //JSON
        user: req.body.usuario,
        password: md5(req.body.password)
    };
    let sql = "SELECT *,DATE_FORMAT(paciente.fechaNacimiento,'%d/%m/%Y') AS FechaF FROM login INNER JOIN paciente ON login.idLogin = paciente.Login_idLogin LEFT JOIN foto ON paciente.Foto_idFoto = foto.idFoto  WHERE user = ? AND password = ?";
    mysql.query(sql, [data.user, data.password], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error" });
        } else {
            if (results != "") {
                const jwt = sign(results, "secret");
                res.status(200).send({
                    codigo: 200,
                    estado: "Success",
                    msg: "Usuario encontrado",
                    datos: results,
                    token: jwt
                });
            } else {
                res.status(202).send({
                    codigo: 202,
                    estado: "Error",
                    msg: "Error, revise sus credenciales"
                });
            }
        }
    })
});

router.post('/api/login-medico', (req, res) => { //Login medico
    let data = { //JSON
        user: req.body.usuario,
        password: md5(req.body.password)
    };
    let sql = "SELECT *,DATE_FORMAT(medico.fechaNacimiento,'%d/%m/%Y') AS FechaF FROM login INNER JOIN medico ON login.idLogin = medico.Login_idLogin LEFT JOIN foto ON medico.Foto_idFoto = foto.idFoto WHERE user = ? AND password = ?";
    mysql.query(sql, [data.user, data.password], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error" });
        } else {
            if (results != "") {
                const jwt = sign(results, "secret");
                res.status(200).send({
                    codigo: 200,
                    estado: "Success",
                    msg: "Usuario encontrado",
                    datos: results,
                    token: jwt
                });
            } else {
                res.status(202).send({
                    codigo: 202,
                    estado: "Error",
                    msg: "Error, revise sus credenciales"
                });
            }
        }
    })
});

router.post('/api/registro-login', (req, res) => { //Registrar paciente
    let data = { //JSON
        email: req.body.email,
        user: req.body.user,
        password: md5(req.body.password)
    }
    let sql = "INSERT INTO login SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al registrar" });
        } else {
            if (results.affectedRows > 0) {
                const token = sign(results, "secret");
                res.status(201).send({ codigo: "201", estado: "Success", msg: "Éxito al registrarse", token: token, idLoginInsertado: results.insertId });
            } else {
                res.status(204).send({
                    code: 204,
                    estado: "Error",
                    msg: "Error, revise sus datos"
                });
            }
        }
    })
});

router.put('/api/edit_password/:id', (req, res) => { //Editar salario empleado
    let data = { //JSON
        password: md5(req.body.password)
    };
    mysql.query('UPDATE login SET ? WHERE idLogin= ?', [data, req.params.id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Password actualizada con éxito"
            });
        }
    })
});

router.put('/api/edit_email/:id', (req, res) => { //Editar salario empleado
    let data = { //JSON
        email: req.body.email
    };
    mysql.query('UPDATE login SET ? WHERE idLogin= ?', [data, req.params.id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send({
                code: 200,
                msg: "Email actualizado con éxito"
            });
        }
    })
});

module.exports = router