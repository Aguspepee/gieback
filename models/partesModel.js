const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

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
    cantidad:{
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
    id: {
        type: Number,
    },
    //DATOS QUE VIENEN EN LA REQ
    numero_reporte: {
        type: String,
    },
    numero_orden: {
        type: String,
    },
    inspector: {
        type: String,
    },
    tag: {
        type: String,
    },
    tag_detalle: {
        type: String,
    },

    //DATOS QUE SALEN DEL CONTRATO
    contrato: {
        type: String,
    },
    cliente: {
        type: String,
    },
    area: { //Es RX, Inspección u Otro
        type: String,
    },
    archivo: {
        type: String,
    },
    fecha_carga: {
        type: Date,
    },
    fecha_inspeccion: {
        type: Date,
    },
    observaciones: {
        type: Number,
    },
    items: [itemsSchema],

    equipo_completo: {
        type: Boolean,
        default: false
    },
    informe_realizado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    informe_fecha: {
        type: Date,
    },
    remito_realizado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    remito_numero: {
        type: Number,
        default: 0
    },
    remito_fecha: {
        type: Date,
    },
    certificado_fealizado: {
        type: Boolean,
        default: false
    },
    certificado_fecha: {
        type: Date,
    },
    modificado: {
        type: Boolean,
        default: false
    },
    modificado_fecha: {
        type: Date,
    },
    modificado_nombre: {
        type: String,
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
})

//creación model
module.exports = mongoose.model("partes", partesSchema)