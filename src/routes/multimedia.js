const express = require('express')
const mysql = require('../conexion')
const router = express.Router()
const multer = require('multer')
const path = require('path')
//const fs = require('fs')
const sign = require('jwt-encode');

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../imagenes/medicosImagenes'),
    filename: (req, file, callback) => {
        //callback(null, Date.now() + '-' + file.originalname)
        callback(null, Date.now() + '-' + file.originalname)
    }
})
const fileUpload = multer({
    storage: diskstorage
}).single('imagen')


router.post('/api/registro-foto-paciente', fileUpload, (req, res) => { //Crear img empleado

    //const nombre = req.file.filename
    let data = { //JSON
        img: req.file.filename,
        type: req.file.mimetype,
        size: req.file.size
    }
    let sql = "INSERT INTO foto SET ?";
    mysql.query(sql, data, (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al subir imagen" });
        } else {
            const token = sign(results, "secret");
            res.status(201).send({ codigo: "201", estado: "Success", datos: results, token: token, idFotoInsertado: results.insertId, img: req.file });
        }
    })
});

router.put('/api/editar-foto/:id', fileUpload, (req, res) => { //Crear img empleado

    //const nombre = req.file.filename
    let data = { //JSON
        img: req.file.filename,
        type: req.file.mimetype,
        size: req.file.size
    }
    
    let sql = "UPDATE foto SET ? WHERE idFoto = ?";
    mysql.query(sql, [data, req.params.id], (error, results) => {
        if (error) {
            //throw error;
            res.status(500).send({ codigo: "500", estado: "Error", msg: "Hubo un error al subir imagen" });
        } else {
            const token = sign(results, "secret");
            res.status(201).send({ codigo: "201", estado: "Success", datos: results, token: token, idFotoInsertado: results.insertId, img: req.file });
        }
    })
});

module.exports = router