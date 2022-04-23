const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

//creación schema
const usersSchema = mongoose.Schema({
    numero_reporte: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    numero_orden: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    inspector: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    tag: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    detalle_tag: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    tipo_detalle: { //Es RX, Inspección u Otro
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    actividad_detalle: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    actividad_item: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    cantidad: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    unidad_medida: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    archivo: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha_dia: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha_mes: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha_año: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha_semana: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    observaciones: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    adicionales: adicionalesSchema,

    equipo_completo: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    informe_realizado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    informe_fecha: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
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
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    certificado_fealizado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    certificado_fecha: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    modificado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    modificado_fecha: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    modificado_nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    eliminado: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    contrato: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    cliente: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    precio_unitario: {
        type: Number,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    precio_total: {
        type: Number,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    detalles_rx: rxSchema,
})

//Se declaran los subSchema
//Este schema contiene todos los datos extra de las actividades de RX 
const rxSchema = mongoose.Schema({
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
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
})

//Este schema contiene todos los datos de los adicionales
const adicionalesSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    detalle: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    item: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    cantidad: {
        type: Number,
        default: 0
    },
    unidad_medida: {
        type: Number,
        default: 0
    },
    precio_unitario: {
        type: Number,
        default: 0
    },
    precio_total: {
        type: Number,
        default: 0
    },
})

//creación model
module.exports = mongoose.model("users", usersSchema)