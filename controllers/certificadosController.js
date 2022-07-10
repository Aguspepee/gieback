const partesModel = require("../models/partesModel")
const certificadosCounterModel = require("../models/certificadosModel")

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
                        _id: "$certificado_numero",
                        certificado_numero: { $first: "$certificado_numero" },
                        items: {
                            $push: {
                                id: "$_id",
                                cantidad: "$items.cantidad",
                                codigo: "$items.codigo_servicio",
                                detalle: "$items.descripcion_servicio",
                                valor_unitario: "$items.valor_unitario",
                                valor_total: "$items.valor_total",
                                equipo: "$tag",
                                fecha_inspeccion: "$fecha_inspeccion",
                                fecha_informe: "$fecha_informe",
                                OT: "$numero_orden",
                                certificante: "$certificante",
                                numero_remito: "$remito_numero",
                                remito_fecha: "$remito_realizado_fecha",
                                clase: "$items.clase"
                            }
                        },
                        contrato: { $first: "$contrato" },
                        operador: { $first: "$operador" },
                        planta: { $first: "$unidad" },
                        fecha: { $first: "$remito_realizado_fecha" },
                        certificado_numero: { $first: "$certificado_numero" },
                        certificado_realizado: { $first: "$certificado_realizado" },
                        certificado_realizado_fecha: { $first: "$certificado_realizado_fecha" },
                        certificado_finalizado: { $first: "$certificado_finalizado" },
                        certificado_finalizado_fecha: { $first: "$certificado_finalizado_fecha" },

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

    number: async function (req, res, next) {
        try {
            //Busca el número del remito que va a hacer y le agrega 1
            const number = await certificadosCounterModel.find({ _id: 'productId' });
            res.status(201).json({ certificado_numero: number[0].sequence_value })
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        console.log("entro", selected)
        try {
            //Busca el número del certificado que va a hacer y le agrega 1
            certificadosCounterModel.findByIdAndUpdate(
                'productId',
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true },
                //En la función de callback, una vez que hace la actualización del número en el contador
                //ejecuta la actualización del numero y las fechas en el modelo. 
                //Tiene que ser si o si una fución async
                async function (err, seq) {
                    if (err) return next(err);
                    console.log("certificado", seq.sequence_value)
                    await partesModel.updateMany({ 'remito_numero': { '$in': selected } }, {
                        certificado_numero: seq.sequence_value,
                        certificado_realizado: true,
                        certificado_realizado_fecha: Date(),
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

    estado: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        console.log(selected)
        console.log(req.body)
        try {
            const documents = await partesModel.updateMany(
                { 'certificado_numero': { '$in': selected } },
                {
                    certificado_finalizado: req.body.certificado_finalizado,
                    certificado_finalizado_fecha: req.body.certificado_finalizado ? Date() : (req.body.certificado_finalizado === false ? null : undefined),
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
                { 'certificado_numero': { '$in': selected } },
                {
                    certificado_finalizado: false,
                    certificado_finalizado_fecha: null,
                    certificado_numero: null,
                    certificado_realizado: false,
                    certificado_realizado_fecha: null,
                })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}