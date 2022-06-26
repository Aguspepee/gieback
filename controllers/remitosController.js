const partesModel = require("../models/partesModel")


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
                                OT: "$numero_orden"
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
}