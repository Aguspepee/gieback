const clientsModel = require("../models/clientsModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const CONFIG = require("../config/config")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await clientsModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        try {
            const client = new clientsModel({
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                email: req.body.email,
                telefono: req.body.password,
                abreviatura: req.body.abreviatura,
                deleted: req.body.deleted,
                image: req.body.image,
            })
            const document = await client.save()
            console.log("se creó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}
