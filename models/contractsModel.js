const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")

const unidadesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
})

const certificantesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    apellido: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
})

const camposSchema = mongoose.Schema({
    cantidad_placas: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
    diametro: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
    espesor: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    numero_costuras: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
    numero_orden: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    numero_reporte: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    unidad: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    tipo_rx: { //está en RX
        type: Boolean,
        enum: [true, false],
        default: false,
    },
    paga: { //está en RX
        type: Boolean,
        enum: [true, false],
        default: false,
    },
})

const itemsSchema = mongoose.Schema({
    descripcion_servicio: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    codigo_servicio: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    tipo_actividad: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    clase: { //gamagrafía o inspección
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    valor: {
        type: Number,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    unidad_medida: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
})

//creación schema
const contractsShema = mongoose.Schema({
    //Datos generales
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    descripcion: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    version: {
        type: Number,
        default:0
    },
    area: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    cliente: {
        type: mongoose.Schema.ObjectId,
        ref: "clients"
    },
    fecha_inicio: {
        type: Date,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    fecha_fin: {
        type: Date,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    ref_oc: {
        type: String,
    },
    activo: {
        type: Boolean,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    deleted: {
        type: Boolean,
        default: false
    },
    items: [itemsSchema],
    unidades: [unidadesSchema],
    certificantes: [certificantesSchema],
    campos: [camposSchema]
})

//creación model
contractsShema.pre("save", function (next) {
    // this.password = bcrypt.hashSync(this.password, 10)
    next()
})

module.exports = mongoose.model("contracts", contractsShema)