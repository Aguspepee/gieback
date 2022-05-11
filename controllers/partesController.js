const partesModel = require("../models/partesModel")
const contractsModel = require("../models/contractsModel")

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

    create: async function (req, res, next) {
        try {

            //Se busca el contrato en la colección de contratos
            const contrato = await contractsModel.find({nombre:req.body.contrato})
            console.log("el contrato",contrato)
            let items = contrato[0].items
            console.log("Los ITEMS", items)
            let item = items.filter(items => items.descripcion_servicio === req.body.descripcion_servicio)[0]
            console.log("El item", item)


            const parte = new partesModel({

                //Datos que vienen de la req
                numero_reporte: req.body.numero_reporte,
                numero_orden: req.body.numero_orden,
                tag: req.body.tag,
                tag_detalle: req.body.tag_detalle,
                informe_realizado: req.body.informe_realizado,
                adicionales: req.body.adicionales,

                //Datos que salen del contrato
                contrato: contrato.nombre,
                cliente: contrato.cliente,
                area: contrato.area,

                //Datos que salen del item del contrato
                items: [{
                    descripcion_servicio: item.descripcion_servicio,
                    codigo_servicio: item.codigo_servicio,
                    tipo_actividad: item.tipo_actividad,
                    clase: item.clase,
                    cantidad: req.body.cantidad,
                    unidad_medida: item.unidad_medida,
                    valor_unitario: item.valor,
                    valor_total: item.valor*req.body.cantidad
                },
                {
                    descripcion_servicio: item.descripcion,
                    codigo_servicio: item.codigo_servicio,
                    unidad_medida: item.unidad_medida,
                    valor_unitario: item.valor,
                }]
            })
            const document = await parte.save().then(
            )
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}