const partesModel = require("../models/partesModel")
var ObjectId = require('mongodb').ObjectID;

module.exports = {
  getIndicadoresAdministrador: async function (req, res, next) {
    const year = new Date().getFullYear()
    console.log(year)
    try {
      const cantidades1 = await partesModel.aggregate([
        [
          {
            '$group': {
              '_id': '',
              'partes_para_remitar': {
                '$sum': {
                  '$cond': [
                    {
                      '$and': [
                        {
                          '$eq': [
                            '$trabajo_terminado', true
                          ]
                        }, {
                          '$eq': [
                            '$informe_realizado', true
                          ]
                        }, {
                          '$eq': [
                            '$informe_revisado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_realizado', false
                          ]
                        }
                      ]
                    }, 1, 0
                  ]
                }
              },
            }
          }
        ]
      ])

      const valores = await partesModel.aggregate([
        [
          {
            '$unwind': {
              'path': '$items'
            }
          }, {
            '$group': {
              '_id': '',
              'partes_para_remitar': {
                '$sum': {
                  '$cond': [
                    {
                      '$and': [
                        {
                          '$eq': [
                            '$trabajo_terminado', true
                          ]
                        }, {
                          '$eq': [
                            '$informe_realizado', true
                          ]
                        }, {
                          '$eq': [
                            '$informe_revisado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_realizado', false
                          ]
                        }
                      ]
                    }, '$items.valor_total', 0
                  ]
                }
              },
              'remitos_para_certificar': {
                '$sum': {
                  '$cond': [
                    {
                      '$and': [
                        {
                          '$eq': [
                            '$remito_realizado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_revisado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_entregado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_firmado', true
                          ]
                        }, {
                          '$eq': [
                            '$certificado_realizado', false
                          ]
                        }
                      ]
                    }, '$items.valor_total', 0
                  ]
                }
              }
            }
          }
        ]
      ])

      const cantidades2 = await partesModel.aggregate([
        [
          {
            '$group': {
              '_id': '$remito_numero',
              'remito_realizado': {
                '$first': '$remito_realizado'
              },
              'remito_revisado': {
                '$first': '$remito_revisado'
              },
              'remito_entregado': {
                '$first': '$remito_entregado'
              },
              'remito_firmado': {
                '$first': '$remito_firmado'
              },
              'certificado_realizado': {
                '$first': '$certificado_realizado'
              }
            }
          }, {
            '$group': {
              '_id': '',
              'remitos_para_certificar': {
                '$sum': {
                  '$cond': [
                    {
                      '$and': [
                        {
                          '$eq': [
                            '$remito_realizado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_revisado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_entregado', true
                          ]
                        }, {
                          '$eq': [
                            '$remito_firmado', true
                          ]
                        }, {
                          '$eq': [
                            '$certificado_realizado', false
                          ]
                        }
                      ]
                    }, 1, 0
                  ]
                }
              }
            }
          }
        ]
      ])
      const documents = [{
        partes_para_remitar: cantidades1[0].partes_para_remitar,
        remitos_para_certificar: cantidades2[0].remitos_para_certificar,
        monto_para_remitar: valores[0].partes_para_remitar,
        monto_para_certificar: valores[0].remitos_para_certificar
      }]

      res.json(documents)
    } catch (e) {
      console.log(e)
      e.status = 400
      next(e)
    }
  },

  getIndicadoresSupervisor: async function (req, res, next) {
    try {
      const documents = await partesModel.aggregate([
        {
          '$group': {
            '_id': '',
            'partes_para_remitar': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_revisado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_realizado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'trabajos_sin_terminar': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'partes_sin_informe': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_realizado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'informes_para_revision': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_realizado', true
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            }
          }
        }
      ])
      res.json(documents)
    } catch (e) {
      console.log(e)
      e.status = 400
      next(e)
    }
  },

  getIndicadoresInspector: async function (req, res, next) {
    try {
      const documents = await partesModel.aggregate([
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
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'informes_no_realizados': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_realizado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'informes_en_revision': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$trabajo_terminado', true
                        ]
                      }, {
                        '$eq': [
                          '$informe_realizado', true
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            }
          }
        }
      ])
      res.json(documents)
    } catch (e) {
      console.log(e)
      e.status = 400
      next(e)
    }
  },

  getIndicadoresAsistente: async function (req, res, next) {
    try {
      const documents = await partesModel.aggregate([
        {
          '$group': {
            '_id': '$remito_numero',
            'remito_realizado': {
              '$first': '$remito_realizado'
            },
            'remito_revisado': {
              '$first': '$remito_revisado'
            },
            'remito_entregado': {
              '$first': '$remito_entregado'
            },
            'remito_firmado': {
              '$first': '$remito_firmado'
            },
            'certificado_realizado': {
              '$first': '$certificado_realizado'
            },
            'certificado_finalizado': {
              '$first': '$certificado_finalizado'
            }
          }
        }, {
          '$group': {
            '_id': '',
            'remitos_pendiente_entrega': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$remito_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_revisado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_entregado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'remitos_pendiente_firma': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$remito_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_revisado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_entregado', true
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'remitos_pendiente_certificado': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$remito_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_revisado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_entregado', true
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            },
            'certificado_realizado': {
              '$sum': {
                '$cond': [
                  {
                    '$and': [
                      {
                        '$eq': [
                          '$remito_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_revisado', true
                        ]
                      }, {
                        '$eq': [
                          '$remito_entregado', true
                        ]
                      }, {
                        '$eq': [
                          '$certificado_realizado', true
                        ]
                      }, {
                        '$eq': [
                          '$certificado_finalizado', false
                        ]
                      }
                    ]
                  }, 1, 0
                ]
              }
            }
          }
        }
      ])
      res.json(documents)
    } catch (e) {
      console.log(e)
      e.status = 400
      next(e)
    }
  },
}