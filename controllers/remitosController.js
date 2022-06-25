const partesModel = require("../models/partesModel")


module.exports = {

    getAll: async function (req, res, next) {
        try {
            const documents = await partesModel.aggregate([
                {
                    '$unwind': {
                        'path': '$items'
                    }
                },
                {
                    '$group': {
                        '_id': '$remito_numero',
                        'items': {
                            '$push': {
                                'id': '$_id',
                                'cantidad': '$items.cantidad',
                                'codigo': '$items.codigo_servicio',
                                'detalle': '$items.descripcion_servicio',
                                'equipo': '$tag',
                                'fecha_inspeccion': '$fecha_inspeccion',
                                'fecha_informe': '$fecha_informe',
                                'OT': '$numero_orden'
                            }
                        },
                        'contrato': {
                            '$first': '$contrato'
                        },
                        'planta': {
                            '$first': '$unidad'
                        },
                        'fecha': {
                            '$first': '$remito_realizado_fecha'
                        }
                    }
                },
                {
                    $match: { '_id': { "$ne": null } }
                },
                {
                    '$sort': {
                        '_id': 1
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
}