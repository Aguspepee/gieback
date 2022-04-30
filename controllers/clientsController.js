const clientsModel = require("../models/clientsModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const CONFIG = require("../config/config")

module.exports = {
    getAll: async function (req, res, next) {
        console.log("entro")
        try {
            const documents = await clientsModel.find()
            res.json(documents)
            console.log()
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getNames: async function (req, res, next) {
        try {
            const documents = await clientsModel.find({}, { nombre: 1, _id: 0 })
            let names = documents.map((documents) => documents.nombre)
            console.log(names)
            res.json(names)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        console.log("entro")
        try {
            const clients = new clientsModel({
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                email: req.body.email,
                telefono: req.body.telefono,
                abreviatura: req.body.abreviatura,
                //deleted: req.body.deleted,
                //image: req.body.image,
            })
            const document = await clients.save()
            console.log("se creó", document)
            res.json(document);
        } catch (e) {
            console.log(e.message)
            e.status = 400
            next(e)
        }
    },

    edit: async function (req, res, next) {
        try {
            const documents = await clientsModel.find({}, { nombre: 1, _id: 0 })
            let names = documents.map((documents) => documents.nombre)
            console.log(names)
            res.json(names)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}
