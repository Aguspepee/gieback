const partesModel = require("../models/partesModel")
const contractsModel = require("../models/contractsModel")
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

    getRestricted: async function (req, res, next) {
        const options = {
            page: req.query.page,
            limit: req.query.rowsPerPage,
        };
        const search = {
            "numero_reporte": req.query["numero_reporte"] || "",
            "tag": req.query["tag"] || "",
            "items.0.descripcion_servicio": req.query["items.0.descripcion_servicio"] || "",
            "items.0.cantidad":req.query["items.0.cantidad"] || "",
            "inspector": req.query["inspector"] || "",
            "numero_orden": req.query["numero_orden"] || "",
            "cliente": req.query["cliente"] || "",
            "contrato":req.query["contrato"] || "" ,
            "unidad": req.query["unidad"] || "",
            "fecha_carga":req.query["fecha_carga"] || "" ,
            "semana_carga": req.query["semana_carga"] || "",
            "fecha_inspeccion": req.query["fecha_inspeccion"] || "",
            "semana_inspeccion":req.query["semana_inspeccion"] || "" ,
            "informe_realizado":req.query["informe_realizado"] || "",
            "items.0.codigo_servicio":req.query["items.0.codigo_servicio"] || "" ,
            "archivo": req.query["archivo"] || "",
        }
console.log(search)

        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        try {
            const documents = await partesModel.aggregate([
                {
                    '$project': {
                        'numero_reporte': 1,
                        'numero_orden': 1,
                        'inspector': 1,
                        'tag': 1,
                        'tag_detalle': 1,
                        'contrato': 1,
                        'cliente': 1,
                        'área': 1,
                        'unidad': 1,
                        'fecha_carga': 1,
                        'semana_carga': {
                            '$isoWeek': '$fecha_carga'
                        },
                        'fecha_inspeccion': 1,
                        'semana_inspeccion': {
                            '$isoWeek': '$fecha_inspeccion'
                        },
                        'informe_realizado': 1,
                        'items.descripcion_servicio': 1,
                        'items.codigo_servicio': 1,
                        'items.clase': 1,
                        'items.cantidad': 1,
                        'items.unidad_medida': 1
                    }
                },
                {
                    "$sort": sort
                },
                {
                    '$match': {
                        $and: [
                            { "numero_reporte": { $regex: search["numero_reporte"], $options: "i" } },
                            { "tag": { $regex: search["tag"], $options: "i" } },
                            { "items.0.descripcion_servicio": { $regex: search["items.0.descripcion_servicio"], $options: "i" } },
                        /*     { "items.0.cantidad": { $regex: search["items.0.cantidad"], $options: "i" } }, */
                           { "inspector": { $regex: search["inspector"], $options: "i" } },
                            { "numero_orden": { $regex: search["numero_orden"], $options: "i" } },
                            { "cliente": { $regex: search["cliente"], $options: "i" } },
                            { "contrato": { $regex: search["contrato"], $options: "i" } },
                            { "unidad": { $regex: search["unidad"], $options: "i" } },
  /*                            { "fecha_carga": { $regex: search["fecha_carga"], $options: "i" } },*/
                            /* { "semana_carga": { $regex: search["semana_carga"], $options: "i" } }, */
                     /*        { "fecha_inspeccion": { $regex: search["fecha_inspeccion"], $options: "i" } }, */
                           /*  { "semana_inspeccion": { $regex: search["semana_inspeccion"], $options: "i" } }, */
                            /* { "informe_realizado": { $regex: search["informe_realizado"], $options: "i" } }, */
                             { "items.0.codigo_servicio": { $regex: search["items.0.codigo_servicio"], $options: "i" } }, 
                            /* { "archivo": { $regex: search["archivo"], $options: "i" } },  */
                        ]
                    }
                }
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

            const contrato = await contractsModel.find({ nombre: req.body.contrato })
            //console.log("EL CONTRATOOOOO",contrato)
            let item = contrato[0].items.filter(items => items.descripcion_servicio === req.body.descripcion_servicio)[0]
            console.log("Contrato", item)
            //En base a los subitems que vienen en el body, se busca la información completa
            //en el listado de items que sale del contrato y se arma el array de subitems
            let subitems = req.body.adicionales.map(
                //(dato) => contrato[0].items.filter(items => items.descripcion_servicio === dato.descripcion_servicio)[0]
                (dato) => {
                    let prueba = contrato[0].items.filter(items => items.descripcion_servicio === dato.descripcion_servicio)[0]
                    prueba.cantidad = dato.cantidad
                    return (prueba)
                }
            )
            let items = [{
                descripcion_servicio: item.descripcion_servicio,
                codigo_servicio: item.codigo_servicio,
                tipo_actividad: item.tipo_actividad,
                clase: item.clase,
                cantidad: req.body.cantidad,
                unidad_medida: item.unidad_medida,
                valor_unitario: item.valor,
                valor_total: item.valor * req.body.cantidad ? item.valor * req.body.cantidad : 0
            }]

            subitems = subitems.map((subitem) => {
                let valor = subitem.unidad_medida === "Porcentaje adicional" ? item.valor * req.body.cantidad * subitem.valor * 1 / 100 : subitem.valor * 1
                //let valor = subitem.tipo_actividad === "Adicional"? 9999999999 : 1111111111111
                return ({ ...subitem, valor_total: valor })
            })
            subitems.map((subitems) => items.push(subitems))

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
            //Se busca el contrato en la colección de contratos
            const contrato = await contractsModel.find({ nombre: req.body.contrato })
            // let items = contrato[0].items

            let item = contrato[0]?.items.filter(items => items.descripcion_servicio === req.body.descripcion_servicio)[0]

            //En base a los subitems que vienen en el body, se busca la información completa
            //en el listado de items que sale del contrato y se arma el array de subitems
            let subitems = req.body.adicionales?.map(
                //(dato) => contrato[0].items.filter(items => items.descripcion_servicio === dato.descripcion_servicio)[0]
                (dato) => {
                    let prueba = contrato[0].items.filter(items => items.descripcion_servicio === dato.descripcion_servicio)[0]
                    prueba.cantidad = dato.cantidad
                    return (prueba)
                }
            )
            let items = [{
                descripcion_servicio: item?.descripcion_servicio,
                codigo_servicio: item?.codigo_servicio,
                tipo_actividad: item?.tipo_actividad,
                clase: item?.clase,
                cantidad: req.body.cantidad,
                unidad_medida: item?.unidad_medida,
                valor_unitario: item?.valor,
                valor_total: item?.valor * req.body.cantidad ? item?.valor * req.body.cantidad : 0
            }]

            subitems = subitems?.map((subitem) => {
                let valor = subitem.unidad_medida === "Porcentaje adicional" ? item.valor * req.body.cantidad * subitem.valor * 1 / 100 : subitem.valor * 1
                //let valor = subitem.tipo_actividad === "Adicional"? 9999999999 : 1111111111111
                return ({ ...subitem, valor_total: valor })
            })
            subitems?.map((subitems) => items.push(subitems))

            const parte = {
                //Datos que vienen de la req
                numero_reporte: req.body.numero_reporte,
                numero_orden: req.body.numero_orden,
                tag: req.body.tag,
                tag_detalle: req.body.tag_detalle,
                informe_realizado: req.body.informe_realizado,
                inspector: req.body.inspector,
                unidad: req.body.unidad,

                //Datos que salen del contrato
                contrato: contrato[0].nombre,
                cliente: contrato[0].cliente,
                area: contrato[0].area,

                //Datos que salen del item del contrato
                items: items,

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
        try {
            const documents = await partesModel.deleteOne({ _id: req.params.id })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}