const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");


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
    },
})

//Este schema contiene todos los datos de los adicionales
const itemsSchema = mongoose.Schema({
    descripcion_servicio: {
        type: String,
        //index: true
    },
    codigo_servicio: {
        type: String,
    },
    tipo_actividad: {
        type: String,
    },
    clase: { //gamagrafía o inspección
        type: String,
    },
    cantidad: {
        type: Number,
        default: 0
    },
    unidad_medida: {
        type: String,
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
        default:""
    },
    numero_orden: {
        type: String,
        default:""
    },
    operador: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    tag: {
        type: String,
        default:""
    },
    tag_detalle: {
        type: String,
        default:""
    },
    unidad: {
        type: String
    },

    //DATOS QUE SALEN DEL CONTRATO
    contrato: {
        type: mongoose.Schema.ObjectId,
        ref: "contracts"
    },
    items: [itemsSchema],
    fecha_carga: {
        type: Date,
        default: new Date()
    },
    fecha_inspeccion: {
        type: Date,
        required: [true, errorMessage.GENERAL.campo_obligatorio]
    },
    observaciones: {
        type: String,
        default:""
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
    remito_realizado: {
        type: Boolean,
        default: false,
        index: true
    },
    remito_numero: {
        type: Number,
    },
    remito_realizado_fecha: {
        type: Date,
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
        default:""
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
    paga:{
        type: mongoose.Schema.ObjectId,
        ref: "clients",
        default: ""
    }
})

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