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

    getRestricted: async function (req, res, next) {
        try {
            const documents = await partesModel.find({}, {
                numero_reporte: 1,
                numero_orden: 1,
                inspector: 1,
                tag: 1,
                tag_detalle: 1,
                contrato: 1,
                cliente: 1,
                área: 1,
                cliente:1, 
                "items.descripcion_servicio": 1,
                "items.codigo_servicio": 1,
                "items.clase": 1,
                "items.cantidad": 1,
                "items.unidad_medida": 1,
            })
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
            console.log("EL CONTRATOOOOO",contrato)
            let item = contrato[0].items.filter(items => items.descripcion_servicio === req.body.descripcion_servicio)[0]
            
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
                valor_total: item.valor * req.body.cantidad
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
                adicionales: req.body.adicionales,
                inspector: req.body.usuario,
                unidad: req.body.unidad,

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
            console.log("EL DOCUMENTO", document)
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
                valor_total: item?.valor * req.body.cantidad?item?.valor * req.body.cantidad:0
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
                adicionales: req.body.adicionales,
                inspector: req.body.usuario,
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