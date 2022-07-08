const partesModel = require("../models/partesModel")
const remitosCounterModel = require("../models/remitosModel")

module.exports = {

    getAll: async function (req, res, next) {
        const options = {
            page: req.query.page,
            limit: req.query.rowsPerPage,
        };
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        console.log(sort)
        console.log(options)
        try {
            const documents = await partesModel.aggregate([
                {
                    '$unwind': {
                        'path': '$items'
                    }
                },
                {
                    '$group': {
                        _id: "$remito_numero",
                        remito_numero: { $first: "$remito_numero" },
                        items: {
                            $push: {
                                id: "$_id",
                                cantidad: "$items.cantidad",
                                codigo: "$items.codigo_servicio",
                                detalle: "$items.descripcion_servicio",
                                equipo: "$tag",
                                fecha_inspeccion: "$fecha_inspeccion",
                                fecha_informe: "$fecha_informe",
                                OT: "$numero_orden",
                                clase: "$items.clase"
                            }
                        },
                        contrato: { $first: "$contrato" },
                        operador: { $first: "$operador" },
                        planta: { $first: "$unidad" },
                        fecha: { $first: "$remito_realizado_fecha" },
                        remito_revisado: { $first: "$remito_revisado" },
                        remito_revisado_fecha: { $first: "$remito_revisado_fecha" },
                        remito_entregado: { $first: "$remito_entregado" },
                        remito_entregado_fecha: { $first: "$remito_entregado_fecha" },
                        remito_firmado: { $first: "$remito_firmado" },
                        remito_firmado_fecha: { $first: "$remito_firmado_fecha" },
                        certificado_numero: { $first: "$certificado_numero" },
                        certificado_realizado: { $first: "$certificado_realizado" },
                        certificado_realizado_fecha: { $first: "$certificado_realizado_fecha" },
                        certificado_finalizado: { $first: "$certificado_finalizado" },
                        certificado_finalizado_Fecha: { $first: "$certificado_finalizado_fecha" },
                        certificante: { $first: "$certificante" },
                    }
                },
                {
                    $lookup:
                    {
                        from: "contracts",
                        localField: "contrato",
                        foreignField: "_id",
                        as: "contrato"
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "operador",
                        foreignField: "_id",
                        as: "operador"
                    }
                },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "contrato.0.cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $match: { '_id': { "$ne": null } }
                },
                {
                    "$sort": sort
                },
            ]).paginateExec(options)
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e) 
        }
    },


    create: async function (req, res, next) {
        console.log(req.body.certificante)
        const selected = req.params.selected.split(',')
        console.log("entro", selected)
        try {
            //Busca el número del remito que va a hacer y le agrega 1
            remitosCounterModel.findByIdAndUpdate(
                'productId',
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true },
                //En la función de callback, una vez que hace la actualización del número en el contador
                //ejecuta la actualización del numero y las fechas en el modelo. 
                //Tiene que ser si o si una fución async
                async function (err, seq) {
                    if (err) return next(err);
                    console.log("remito", seq.sequence_value)
                    await partesModel.updateMany({ '_id': { '$in': selected } }, {
                        remito_numero: seq.sequence_value,
                        remito_realizado: true,
                        remito_realizado_fecha: Date(),
                        certificante: req.body.certificante
                    })
                    res.status(201).json("document")
                }
            );
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    number: async function (req, res, next) {
        try {
            //Busca el número del remito que va a hacer y le agrega 1
            const number = await remitosCounterModel.find({ _id: 'productId' });
            res.status(201).json({ remito_numero: number[0].sequence_value })
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    estado: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        console.log(selected)
        console.log(req.body)
        try {
            const documents = await partesModel.updateMany(
                { 'remito_numero': { '$in': selected } },
                {
                    remito_entregado: req.body.remito_entregado,
                    remito_entregado_fecha: req.body.remito_entregado ? Date() : (req.body.remito_entregado === false ? null : undefined),
                    remito_firmado: req.body.remito_firmado,
                    remito_firmado_fecha: req.body.remito_firmado ? Date() : (req.body.remito_firmado === false ? null : undefined),
                    remito_revisado: req.body.remito_revisado,
                    remito_revisado_fecha: req.body.remito_revisado ? Date() : (req.body.remito_revisado === false ? null : undefined),
                })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    delete: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        try {
            const documents = await partesModel.updateMany(
                { 'remito_numero': { '$in': selected } },
                {
                    remito_numero: null,
                    remito_realizado: false,
                    remito_realizado_fecha: null,
                    remito_entregado: false,
                    remito_entregado_fecha: null,
                    remito_firmado: false,
                    remito_firmado_fecha: null,
                    remito_revisado: false,
                    remito_revisado_fecha: null,
                    certificado_finalizado: false,
                    certificado_finalizado_Fecha: null,
                    certificado_numero: null,
                    certificado_realizado: false,
                    certificado_realizado_fecha: null,
                    certificante: ""
                })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}