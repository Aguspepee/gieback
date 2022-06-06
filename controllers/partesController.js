const partesModel = require("../models/partesModel")
const contractsModel = require("../models/contractsModel")
const bTA = require("../util/booleanToArray")
var qs = require('qs');

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await partesModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getOne: async function (req, res, next) {
        try {
            const documents = await partesModel.findById(req.params.id)
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getRestricted: async function (req, res, next) {
        const options = {
            page: req.query.page,
            limit: req.query.rowsPerPage,
        };
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        try {
            const documents = await partesModel.aggregate([
                {
                    $addFields: {
                        semana_carga: { $toString: { '$isoWeek': '$fecha_carga' } },
                        semana_inspeccion: { $toString: { '$isoWeek': '$fecha_inspeccion' } },
                        mes_inspeccion: { $toString: { '$month': '$fecha_inspeccion' } },
                        AAsem_inspeccion: { $concat: [{ $toString: { $year: "$fecha_inspeccion" } }, "/", { $toString: { $isoWeek: "$fecha_inspeccion" } }] },
                        AAMM_inspeccion: { $concat: [{ $toString: { $year: "$fecha_inspeccion" } }, "/", { $toString: { $month: "$fecha_inspeccion" } }] },
                        archivo: {
                            $concat: ["$unidad", "_", "$numero_reporte", "_",
                                { $first: { $map: { input: "$items", as: "r", in: { $toString: "$$r.tipo_actividad" } } } }, "_", "$tag", "_",
                                {
                                    $let: {
                                        vars: { monthsInString: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'] },
                                        in: { $arrayElemAt: ['$$monthsInString', { '$month': '$fecha_inspeccion' }] }
                                    }
                                },
                                { $toString: { '$dayOfMonth': '$fecha_inspeccion' } }
                            ]
                        },
                        items_cantidad: { $first: { $map: { input: "$items", as: "r", in: { $toString: "$$r.cantidad" } } } }
                    }
                },
                { $unset: ['items.valor_total', 'items.valor_unitario'] },
                {
                    '$match': {
                        $and: [
                            { "numero_reporte": { $regex: req.query["numero_reporte"] || "", $options: "i" } },
                            { "tag": { $regex: req.query["tag"] || "", $options: "i" } },
                            { "items.0.descripcion_servicio": { $regex: req.query["items.0.descripcion_servicio"] || "", $options: "i" } },
                            { "items.0.codigo_servicio": { $regex: req.query["items.0.codigo_servicio"] || "", $options: "i" } },
                            { "items_cantidad": { $regex: req.query["items.0.cantidad"] || "", $options: "i" } },
                            { "inspector": { $regex: req.query["inspector"] || "", $options: "i" } },
                            { "numero_orden": { $regex: req.query["numero_orden"] || "", $options: "i" } },
                            { "cliente": { $regex: req.query["cliente"] || "", $options: "i" } },
                            { "contrato": { $regex: req.query["contrato"] || "", $options: "i" } },
                            { "unidad": { $regex: req.query["unidad"] || "", $options: "i" } },
                            /* { "fecha_carga": { $regex: req.query["fecha_carga"] || "", $options: "i" } },*/
                            { "semana_carga": { $regex: req.query["semana_carga"] || "", $options: "i" } },
                            /* { "fecha_inspeccion": { $regex: req.query["fecha_inspeccion"] || "", $options: "i" } }, */
                            { "AAMM_inspeccion": { $regex: req.query["AAMM_inspeccion"] || "", $options: "i" } },
                            { "AAsem_inspeccion": { $regex: req.query["AAsem_inspeccion"] || "", $options: "i" } },
                            { "semana_inspeccion": { $regex: req.query["semana_inspeccion"] || "", $options: "i" } },
                            { "archivo": { $regex: req.query["archivo"] || "", $options: "i" } },

                            //Campos Booleanos
                            { "trabajo_terminado": { $in: bTA.booleanToArray(req.query["trabajo_terminado"]) || [true, false] } },
                            { "informe_realizado": { $in: bTA.booleanToArray(req.query["informe_realizado"]) || [true, false] } },
                            { "informe_revisado": { $in: bTA.booleanToArray(req.query["informe_revisado"]) || [true, false] } },
                            { "remito_realizado": { $in: bTA.booleanToArray(req.query["remito_realizado"]) || [true, false] } },
                            { "certificado_realizado": { $in: bTA.booleanToArray(req.query["certificado_realizado"]) || [true, false] } },
                        ]
                    }
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

    getUnrestricted: async function (req, res, next) {
        try {
            const documents = await partesModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        try {
            //Se busca el contrato en la colección de contratos
            console.log(req.body.contrato)
            const contrato = await contractsModel.find({ nombre: req.body.contrato })
            let items = req.body.items.map((item) => {
                let item_contrato = (contrato[0].items.filter(items => items.descripcion_servicio === item.descripcion_servicio)[0]).toJSON()
                item_contrato.cantidad = item.cantidad
                return (item_contrato)
            })
            //Se asignan los valores al los items
            items[0].valor_unitario = items[0].valor
            items[0].valor_total = items[0].valor * items[0].cantidad
            for (let i = 1; i < items.length; i++) {
                //Si es porcentaje adicional calcula el porcentaje
                if (items[i].unidad_medida === "Porcentaje adicional") {
                    items[i].valor_unitario = items[0].valor * items[0].cantidad * items[i].valor * 1 / 100;
                    items[i].valor_total = items[i].valor_unitario * items[i].cantidad;
                    //Si no es porcentaje adicional lo calcula como un item común
                } else {
                    items[i].valor_unitario = items[i].valor
                    items[i].valor_total = items[i].valor_unitario * items[i].cantidad;
                }
            }

            const parte = new partesModel({
                //Datos que vienen de la req
                numero_reporte: req.body.numero_reporte,
                numero_orden: req.body.numero_orden,
                tag: req.body.tag,
                tag_detalle: req.body.tag_detalle,
                informe_realizado: req.body.informe_realizado,
                inspector: req.body.inspector,
                unidad: req.body.unidad,
                fecha_inspeccion: req.body.fecha_inspeccion,
                //Datos que salen del contrato
                contrato: contrato[0].nombre,
                cliente: contrato[0].cliente,
                area: contrato[0].area,
                //Datos que salen del item del contrato
                items: items,
                //Detalles (por lo general de RX)
                detalles: req.body.detalles
            })
            const document = await parte.save().then()
            console.log("Documento", document)
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
            let contrato
            let items
            if (req.body.contrato) {
                //Se busca el contrato en la colección de contratos
                contrato = await contractsModel.find({ nombre: req.body.contrato })
                items = req.body.items.map((item) => {
                    let item_contrato = (contrato[0].items.filter(items => items.descripcion_servicio === item.descripcion_servicio)[0]).toJSON()
                    item_contrato.cantidad = item.cantidad
                    return (item_contrato)
                })
                //Se asignan los valores al los items
                items[0].valor_unitario = items[0].valor
                items[0].valor_total = items[0].valor * items[0].cantidad
                for (let i = 1; i < items.length; i++) {
                    //Si es porcentaje adicional calcula el porcentaje
                    if (items[i].unidad_medida === "Porcentaje adicional") {
                        items[i].valor_unitario = items[0].valor * items[0].cantidad * items[i].valor * 1 / 100;
                        items[i].valor_total = items[i].valor_unitario * items[i].cantidad;
                        //Si no es porcentaje adicional lo calcula como un item común
                    } else {
                        items[i].valor_unitario = items[i].valor
                        items[i].valor_total = items[i].valor_unitario * items[i].cantidad;
                    }
                }
            }

            const parte = {
                //Datos que vienen de la req
                numero_reporte: req.body.numero_reporte,
                numero_orden: req.body.numero_orden,
                tag: req.body.tag,
                tag_detalle: req.body.tag_detalle,
                inspector: req.body.inspector,
                unidad: req.body.unidad,
                fecha_inspeccion: req.body.fecha_inspeccion,

                //Pares BOOLEANO-FECHA
                trabajo_terminado: req.body.trabajo_terminado,
                trabajo_terminado_fecha: req.body.trabajo_terminado ? Date() : (req.body.trabajo_terminado === false ? null : undefined),
                informe_realizado: req.body.informe_realizado,
                informe_realizado_fecha: req.body.informe_realizado ? Date() : (req.body.informe_realizado === false ? null : undefined),
                informe_revisado: req.body.informe_revisado,
                informe_revisado_fecha: req.body.informe_revisado ? Date() : (req.body.informe_revisado === false ? null : undefined),
                remito_realizado: req.body.remito_realizado,
                remito_realizado_fecha: req.body.remito_realizado ? Date() : (req.body.remito_realizado === false ? null : undefined),
                certificado_realizado: req.body.certificado_realizado,
                certificado_realizado_fecha: req.body.certificado_realizado ? Date() : (req.body.certificado_realizado === false ? null : undefined),

                //Datos que salen del contrato
                contrato: contrato ? contrato[0]?.nombre : undefined,
                cliente: contrato ? contrato[0]?.cliente : undefined,
                area: contrato ? contrato[0]?.area : undefined,
                //Datos que salen del item del contrato
                items: items || undefined,
                //Detalles (por lo general de RX)
                detalles: req.body.detalles
            }
            const document = await partesModel.findByIdAndUpdate(req.params.id, parte, { new: true })
            console.log("se actualizó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    delete: async function (req, res, next) {
        console.log("HOLAAAAAAAAAAAA")
        try {
            const documents = await partesModel.deleteOne({ _id: req.params.id })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    deleteMany: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        console.log("HOLAAAAAAAAAAAA", selected)
        try {
            const documents = await partesModel.deleteMany({ '_id': { '$in': selected } })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}