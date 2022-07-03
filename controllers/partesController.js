const partesModel = require("../models/partesModel")
const contractsModel = require("../models/contractsModel")
const bTA = require("../util/booleanToArray")
var qs = require('qs');
var ObjectId = require('mongodb').ObjectID;


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
            const documents = await partesModel.aggregate([
                {
                    $match: { _id: ObjectId(req.params.id) }
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
                        from: "contracts",
                        localField: "contrato",
                        foreignField: "_id",
                        as: "contrato"
                    }
                },
                { $unset: ['contrato.items.valor', 'contrato.certificantes', 'contrato.descripcion_servicio'] },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "contrato.cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "paga",
                        foreignField: "_id",
                        as: "paga"
                    }
                },
            ])
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
                /*                 {
                                    '$match': { remito_realizado: false }
                                },  */

                {
                    $addFields: {
                        Id_str: { $toString: "$Id" },
                        remito_numero_str: { $toString: "$remito_numero" },
                        semana_carga: { $toString: { '$isoWeek': '$fecha_carga' } },
                        semana_inspeccion: { $toString: { '$isoWeek': '$fecha_inspeccion' } },
                        mes_inspeccion: { $toString: { '$month': '$fecha_inspeccion' } },
                        //AAsem_inspeccion: { $concat: [{ $toString: { $year: "$fecha_inspeccion" } }, "/", { $toString: { $isoWeek: "$fecha_inspeccion" } }] },
                        AAsem_inspeccion: { $concat: [{ $dateToString:{ format: "%Y",date:"$fecha_inspeccion"} } , "/", { $dateToString: { format:"%V",date: "$fecha_inspeccion" } }] },
                        //AAMM_inspeccion: { $concat: [{ $toString: { $year: "$fecha_inspeccion" } }, "/", { $toString: { $month: "$fecha_inspeccion" } }] },
                        AAMM_inspeccion: { $concat: [{ $dateToString:{ format: "%Y",date:"$fecha_inspeccion"} } , "/", { $dateToString: { format:"%m",date: "$fecha_inspeccion" } }] },
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
                            { "Id_str": { $regex: req.query["Id"] || "", $options: "i" } },
                            { "numero_reporte": { $regex: req.query["numero_reporte"] || "", $options: "i" } },
                            { "tag": { $regex: req.query["tag"] || "", $options: "i" } },
                            { "tag_detalle": { $regex: req.query["tag_detalle"] || "", $options: "i" } },
                            { "items.0.descripcion_servicio": { $regex: req.query["items.0.descripcion_servicio"] || "", $options: "i" } },
                            { "items.0.codigo_servicio": { $regex: req.query["items.0.codigo_servicio"] || "", $options: "i" } },
                            { "items_cantidad": { $regex: req.query["items.0.cantidad"] || "", $options: "i" } },
                            { "items.0.tipo_actividad": { $regex: req.query["items.0.tipo_actividad"] || "", $options: "i" } },
                            { "items.0.clase": { $regex: req.query["items.0.clase"] || "", $options: "i" } },
                            { "numero_orden": { $regex: req.query["numero_orden"] || "", $options: "i" } },
                            /*  { "cliente": { $regex: req.query["cliente"] || "", $options: "i" } },
                             { "contrato": { $regex: req.query["contrato"] || "", $options: "i" } }, */
                            { "unidad": { $regex: req.query["unidad"] || "", $options: "i" } },
                            /* { "fecha_carga": { $regex: req.query["fecha_carga"] || "", $options: "i" } },*/
                        //    { "semana_carga": { $regex: req.query["semana_carga"] || "", $options: "i" } },
                            /* { "fecha_inspeccion": { $regex: req.query["fecha_inspeccion"] || "", $options: "i" } }, */
                        //    { "AAMM_inspeccion": { $regex: req.query["AAMM_inspeccion"] || "", $options: "i" } },
                         //   { "AAsem_inspeccion": { $regex: req.query["AAsem_inspeccion"] || "", $options: "i" } },
                        //    { "semana_inspeccion": { $regex: req.query["semana_inspeccion"] || "", $options: "i" } },
                            { "archivo": { $regex: req.query["archivo"] || "", $options: "i" } },
                            { "observaciones": { $regex: req.query["observaciones"] || "", $options: "i" } },
                            { "modificado_nombre": { $regex: req.query["modificado_nombre"] || "", $options: "i" } },

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
                        from: "contracts",
                        localField: "contrato",
                        foreignField: "_id",
                        as: "contrato"
                    }
                },
                { $unset: ['contrato.items.valor', 'contrato.descripcion_servicio'] },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "contrato.cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $lookup:
                    {
                        from: "clients",
                        localField: "paga",
                        foreignField: "_id",
                        as: "paga"
                    }
                },
                {
                    $addFields: {
                        "operador.nombre_completo": {
                            "$map": {
                                "input": "$operador",
                                "as": "o",
                                "in": { "$concat": ["$$o.apellido", ", ", "$$o.nombre"] },
                            }
                        },
                        "paga.0.nombre": { $ifNull: ["$paga.0.nombre", "626d99480581fea5022d628e"] }
                    }
                },
                {
                    '$match': {
                        $and: [
                            { "cliente.0.nombre": { $regex: req.query["cliente.0.nombre"] || "", $options: "i" } },
                            { "contrato.0.nombre": { $regex: req.query["contrato.0.nombre"] || "", $options: "i" } },
                            { "operador.0.nombre": { $regex: req.query["operador.0.nombre"] || "", $options: "i" } },
                            { "paga.0.nombre": { $regex: req.query["paga.0.nombre"] || "", $options: "i" } }
                        ]
                    }
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
            //console.log("Contrato", req.body.contrato)
            const contrato = await contractsModel.find({ _id: req.body.contrato })
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
                operador: req.body.operador,
                unidad: req.body.unidad,
                fecha_inspeccion: req.body.fecha_inspeccion,
                remito_realizado: req.body.remito_realizado,
                remito_realizado_fecha: req.body.remito_realizado_fecha,
                remito_numero: req.body.remito_numero,
                contrato: req.body.contrato._id,
                items: items,
                detalles: req.body.detalles,
                paga: req.body.paga,
                trabajo_terminado: req.body.trabajo_terminado,
                trabajo_terminado_fecha: req.body.trabajo_terminado === true ? new Date() : null,
                informe_realizado: req.body.informe_realizado,
                informe_realizado_fecha: req.body.informe_realizado === true ? new Date() : null,
                observaciones: req.body.observaciones
            })
            const document = await parte.save().then()
            //console.log("Documento", document)
            res.json("guardó");
        } catch (e) {
            console.log("ERROR", req.body)
            console.log(e)
            e.status = 400
            next(e)
        }
    },


    masiva: async function (req, res, next) {
        try {
            //Se busca el contrato en la colección de contratos
            //console.log("Contrato", req.body.contrato)
            const contrato = await contractsModel.find({ _id: req.body.contrato })
            let items = req.body.items.map((item) => {
                let item_contrato = (contrato[0].items.filter(items => items.codigo_servicio === item.codigo_servicio.toString())[0]).toJSON()
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
                operador: req.body.operador,
                unidad: req.body.unidad,
                fecha_inspeccion: req.body.fecha_inspeccion,
                remito_realizado: req.body.remito_realizado,
                remito_realizado_fecha: req.body.remito_realizado_fecha,
                remito_numero: req.body.remito_numero,
                certificado_realizado: req.body.certificado_realizado,
                certificado_realizado_fecha: req.body.certificado_realizado_fecha,
                certificado_numero: req.body.certificado_numero,
                contrato: req.body.contrato._id,
                items: items,
                detalles: req.body.detalles,
                paga: req.body.paga,
                trabajo_terminado: req.body.trabajo_terminado,
                trabajo_terminado_fecha: req.body.trabajo_terminado === true ? new Date() : null,
                informe_realizado: req.body.informe_realizado,
                informe_realizado_fecha: req.body.informe_realizado === true ? new Date() : null,
                observaciones: req.body.observaciones,

                //Nuevos Campos Paro de Planta
                fecha_planificacion_inicio: req.body.fecha_planificacion_inicio,
                fecha_planificacion_fin: req.body.fecha_planificacion_fin,
                descripcion_actividad: req.body.descripcion_actividad,
                JN: req.body.JN,
                clasificacion: req.body.clasificacion,
                tiempo_plan:req.body.tiempo_plan,
                peso: req.body.peso,
                curva_S_plan: req.body.curva_S_plan
            })
            const document = await parte.save().then()
            //console.log("Documento", document)
            res.json("guardó");
        } catch (e) {
            console.log("ERROR", req.body)
            console.log(e)
            e.status = 400
            next(e)
        }
    },


    edit: async function (req, res, next) {
        console.log("Hola", req.body)
        console.log("Params", req.params.id)
        const data = req.body
        let items
        try {

            if (req.body.contrato) {


                //Se busca el contrato en la colección de contratos
                const contrato = await contractsModel.find({ _id: data.contrato._id })
                items = data.items.map((item) => {
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
                numero_reporte: data.numero_reporte,
                numero_orden: data.numero_orden,
                tag: data.tag,
                tag_detalle: data.tag_detalle,
                operador: data.operador ? data.operador._id : undefined,
                unidad: data.unidad,
                fecha_inspeccion: data.fecha_inspeccion,
                observaciones: data.observaciones,
                detalles: data.detalles,


                //Pares BOOLEANO-FECHA
                trabajo_terminado: req.body.trabajo_terminado,
                trabajo_terminado_fecha: req.body.trabajo_terminado ? Date() : (req.body.trabajo_terminado === false ? null : undefined),
                informe_realizado: req.body.informe_realizado,
                informe_realizado_fecha: req.body.informe_realizado ? Date() : (req.body.informe_realizado === false ? null : undefined),
                informe_revisado: req.body.informe_revisado,
                informe_revisado_fecha: req.body.informe_revisado ? Date() : (req.body.informe_revisado === false ? null : undefined),
                remito_realizado: req.body.remito_realizado,
                remito_numero: req.body.remito_realizado ? 1234 : (req.body.remito_realizado === false ? null : undefined),
                remito_realizado_fecha: req.body.remito_realizado ? Date() : (req.body.remito_realizado === false ? null : undefined),
                certificado_realizado: req.body.certificado_realizado,
                certificado_realizado_fecha: req.body.certificado_realizado ? Date() : (req.body.certificado_realizado === false ? null : undefined),

                //Datos que salen del item del contrato
                items: items ? items : undefined,
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

    remitoDelete: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        try {
            const documents = await partesModel.findByIdAndUpdate(
                selected,
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
                })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    certificadoDelete: async function (req, res, next) {
        const selected = req.params.selected.split(',')
        try {
            const documents = await partesModel.findByIdAndUpdate(
                selected,
                {
                    certificado_finalizado: false,
                    certificado_finalizado_Fecha: null,
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

    delete: async function (req, res, next) {
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