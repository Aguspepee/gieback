const partesModel = require("../models/partesModel")
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    getIndicadoresInspector: async function (req, res, next) {
        try {
            const documents = await partesModel.aggregate([
                [
                    {
                      '$match': {
                        'operador': ObjectId(req.params.id)
                      }
                    }, {
                      '$group': {
                        '_id': '$operador', 
                        'inspecciones_realizadas': {
                          '$sum': {
                            '$cond': [
                              {}, 1, 0
                            ]
                          }
                        }, 
                        'trabajos_no_terminados': {
                          '$sum': {
                            '$cond': [
                              {
                                '$eq': [
                                  '$trabajo_terminado', false
                                ]
                              }, 1, 0
                            ]
                          }
                        }, 
                        'informes_no_realizados': {
                          '$sum': {
                            '$cond': [
                              {
                                '$eq': [
                                  '$informe_realizado', false
                                ]
                              }, 1, 0
                            ]
                          }
                        }
                      }
                    }, {
                      '$addFields': {
                        'porcentaje_trabajos_no_terminados': {
                          '$round': [
                            {
                              '$multiply': [
                                {
                                  '$divide': [
                                    '$trabajos_no_terminados', '$inspecciones_realizadas'
                                  ]
                                }, 100
                              ]
                            }, 2
                          ]
                        }, 
                        'porcentaje_informes_no_realizados': {
                          '$round': [
                            {
                              '$multiply': [
                                {
                                  '$divide': [
                                    '$informes_no_realizados', '$inspecciones_realizadas'
                                  ]
                                }, 100
                              ]
                            }, 2
                          ]
                        }
                      }
                    }
                  ]




            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}