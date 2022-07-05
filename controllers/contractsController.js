const contractsModel = require("../models/contractsModel")
var ObjectId = require('mongodb').ObjectID;

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

    getSearch: async function (req, res, next) {
        console.log("search")
        try {
            const documents = await contractsModel.aggregate([
                {
                    $match: {
                        $and: [
                            { "nombre": { $regex: req.query["nombre"] || "", $options: "i" } },
                            { deleted: false },
                        ]
                    }
                },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $project: {
                        nombre: 1,
                        cliente: 1,
                        cliente_nombre: "$cliente.nombre",
                        fecha_inicio: 1,
                        version: 1,
                        ref_oc: 1,
                        area: 1,
                        activo: 1,
                        campos: 1,
                        unidades: 1,
                        certificantes: 1,
                        "items.descripcion_servicio": 1,
                        "items.clase": 1,
                        "items.unidad_medida": 1
                    }
                }
            ])
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
            const documents = await contractsModel.find({}, { nombre: 1, _id: 0 })
            let names = documents.map((documents) => documents.nombre)
            console.log(names)
            res.json(names)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getList: async function (req, res, next) {
        try {
            const documents = await contractsModel.aggregate([
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $project: {
                        nombre: 1,
                        cliente: 1,
                        cliente_nombre: "$cliente.nombre",
                        fecha_inicio: 1,
                        area: 1,
                        activo: 1,
                        campos: 1,
                        unidades: 1,
                        certificantes: 1,
                        "items.descripcion_servicio": 1,
                        "items.clase": 1,
                        "items.unidad_medida": 1
                    }
                }
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getItems: async function (req, res, next) {
        try {
            const documents = await contractsModel.find({}, { nombre: 1, cliente: 1, fecha_inicio: 1, area: 1, activo: 1 })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getOne: async function (req, res, next) {
        console.log("esta", req.params.id)
        try {
            const documents = await contractsModel.aggregate([
                {
                    $match: {
                        _id: ObjectId(req.params.id),
                    },
                },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                }
            ]);
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
                area: req.body.area,
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

    empty: async function (req, res, next) {
        console.log("entroooo")
        try {
            const contract = new contractsModel({
                nombre: " ",
                descripcion: " ",
                area: " ",
                cliente: " ",
                fecha_inicio: new Date(),
                fecha_fin: new Date(),
                activo: true,
                unidades: [],
                items: [],
                certificantes: [],
                campos: {
                    numero_reporte: true,
                    numero_orden: true,
                    adicionales: true,
                    equipo_completo: true,
                    diametro: false,
                    espesor: false,
                    numero_costuras: false,
                    cantidad_placas: false,
                    tipo_ensayo: false,
                }
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
        console.log(req.body)
        try {
            const contract = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                ref_oc: req.body.ref_oc,
                version: req.body.version,
                area: req.body.area,
                cliente: req.body.cliente,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                activo: req.body.activo,
                unidades: req.body.unidades,
                items: req.body.items,
                certificantes: req.body.certificantes,
                campos: req.body.campos

            }
            const document = await contractsModel.findByIdAndUpdate(req.params.id, contract, { new: true })
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
            const documents = await contractsModel.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}
