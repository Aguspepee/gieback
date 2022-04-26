const contractsModel = require("../models/contractsModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const CONFIG = require("../config/config")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await contractsModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
    createContract: async function (req, res, next) {
        console.log(req.body.unidades)
        try {
            const contract = new contractsModel({
                
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                tipo: req.body.tipo,
                cliente: req.body.cliente,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin, 
                unidades: req.body.unidades   
            })
            const document = await contract.save()
            console.log("se creó", document)
            res.status(201).json(document);
        } catch (e) { 
            console.log(e)
            e.status = 400
            next(e)
        }
    },

}