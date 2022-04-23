const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

//creación schema
const usersShema = mongoose.Schema({
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
    unidad: {
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
    adicionales: {
        type: Array,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
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
})
//creación model
usersShema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("users", usersShema)