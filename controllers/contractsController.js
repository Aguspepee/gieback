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

    getNames: async function (req, res, next) {
        try {
            const documents = await contractsModel.find({}, { nombre: 1 })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getList: async function (req, res, next) {
        try {
            const documents = await contractsModel.find({}, { nombre: 1, cliente: 1, fecha_inicio: 1, tipo: 1, activo: 1 })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        console.log(req.body.unidades)
        try {
            const contract = new contractsModel({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                tipo: req.body.tipo,
                cliente: req.body.cliente,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                activo: req.body.activo,
                unidades: req.body.unidades,
                items: req.body.items,
                certificantes: req.body.certificantes,
                campos: req.body.campos

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

    edit: async function (req, res, next) {
        console.log(req.params.id)
        try {
            const contract = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                tipo: req.body.tipo,
                cliente: req.body.cliente,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                activo: req.body.activo,
                unidades: req.body.unidades,
                items: req.body.items,
                certificantes: req.body.certificantes,
                campos: req.body.campos

            }
            const document = await contractsModel.findByIdAndUpdate(req.params.id, contract ,{new: true})
            console.log("se actualizó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    delete: async function (req, res, next) {
        try {
            const documents = await contractsModel.deleteOne({_id:req.params.id})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}
