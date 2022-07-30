const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//Contador Partes
var CounterPartesSchema = mongoose.Schema(
    {
        _id: { type: String, required: true },
        sequence_value: { type: Number, default: 1 }
    }
);
var CounterPartes = mongoose.model('CounterPartes', CounterPartesSchema);


//Se declaran los subSchema
//Este schema contiene todos los datos extra de las actividades de RX 
const detallesSchema = mongoose.Schema({
    diametro: {
        type: Number,
        default: 0
    },
    espesor: {
        type: Number,
        default: 0
    },
    numero_costuras: {
        type: Number,
        default: 0
    },
    cantidad_placas: {
        type: Number,
        default: 0
    },
    tipo: {
        type: String,
        default: ""
    },
})

//Este schema contiene todos los datos de los adicionales
const itemsSchema = mongoose.Schema({
    descripcion_servicio: {
        type: String,
        default: ""
        //index: true
    },
    codigo_servicio: {
        type: String,
        default: ""
    },
    tipo_actividad: {
        type: String,
        default: ""
    },
    clase: { //gamagrafía o inspección
        type: String,
        default: ""
    },
    cantidad: {
        type: Number,
        default: 0
    },
    unidad_medida: {
        type: String,
        default: ""
    },
    valor_unitario: {
        type: Number,
        default: 0
    },
    valor_total: {
        type: Number,
        default: 0
    }
})

//creación schema
const partesSchema = mongoose.Schema({
    Id: {
        type: Number,
        require: true
    },
    //DATOS QUE VIENEN EN LA REQ
    numero_reporte: {
        type: String,
        default: ""
    },
    numero_orden: {
        type: String,
        default: ""
    },
    operador: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    tag: {
        type: String,
        default: ""
    },
    tag_detalle: {
        type: String,
        default: ""
    },
    unidad: {
        type: String,
        default: ""
    },
    contrato: {
        type: mongoose.Schema.ObjectId,
        ref: "contracts"
    },
    items: [itemsSchema],
    fecha_carga: {
        type: Date,
        default: null
    },
    fecha_inspeccion: {
        type: Date,
        default:null
    },
    observaciones: {
        type: String,
        default: ""
    },
    trabajo_terminado: {
        type: Boolean,
        default: false
    },
    trabajo_terminado_fecha: {
        type: Date,
        default: null
    },
    informe_realizado: {
        type: Boolean,
        default: false
    },
    informe_realizado_fecha: {
        type: Date,
        default: null
    },
    informe_revisado: {
        type: Boolean,
        default: false
    },
    informe_revisado_fecha: {
        type: Date,
        default: null
    },

    //REMITOS
    remito_numero: {
        type: Number,
        default: null
    },
    remito_realizado: {
        type: Boolean,
        default: false,
    },
    remito_realizado_fecha: {
        type: Date,
        default: null
    },
    remito_revisado: {
        type: Boolean,
        default: false,
    },
    remito_revisado_fecha: {
        type: Date,
        default: null
    },
    remito_entregado: {
        type: Boolean,
        default: false,
    },
    remito_entregado_fecha: {
        type: Date,
        default: null
    },
    remito_firmado: {
        type: Boolean,
        default: false,
    },
    remito_firmado_fecha: {
        type: Date,
        default: null
    },

    //CERTIFICADO
    certificado_numero: {
        type: Number,
        default: null
    },
    certificado_realizado: {
        type: Boolean,
        default: false
    },
    certificado_realizado_fecha: {
        type: Date,
        default: null
    },
    certificado_finalizado: {
        type: Boolean,
        default: false
    },
    certificado_finalizado_fecha: {
        type: Date,
        default: null
    },
    certificante: {
        type: String,
        default: ""
    },



    //PARO PARA PLANIFICACIÓN
    fecha_planificacion_inicio: {
        type: Date,
        default: null
    },
    fecha_planificacion_fin: {
        type: Date,
        default: null
    },
    descripcion_actividad: {
        type: String,
        default: ""
    },
    JN: {
        type: String,
        default: ""
    },
    clasificacion: {
        type: String,
        default: ""
    },
    tiempo_plan: {
        type: Number,
        default: 0
    },
    peso: {
        type: Number,
        default: 0
    },
    curva_S_plan: {
        type: Number,
        default: 0
    },

    //Varios
    modificado: {
        type: Boolean,
        default: false
    },
    modificado_fecha: {
        type: Date,
        default: null
    },
    modificado_nombre: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    },
    valor_unitario: {
        type: Number,
    },
    valor_total: {
        type: Number,
    },
    detalles: detallesSchema,
    paga: {
        type: mongoose.Schema.ObjectId,
        ref: "clients",
        default: ""
    }
}, { timestamps: true })

partesSchema.pre('save', function (next) {
    var doc = this;
    CounterPartes.findByIdAndUpdate(
        'productId',
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true },
        function (err, seq) {
            if (err) return next(err);
            doc.Id = seq.sequence_value;
            next();
        }
    );
}
);


partesSchema.plugin(aggregatePaginate);
//creación model
module.exports = mongoose.model("partes", partesSchema)