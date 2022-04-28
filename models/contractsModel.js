const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")

const unidadesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    abreviatura: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        maxlength: [3, errorMessage.GENERAL.min_length]
    },
})

const certificantesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    apellido: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
})

const itemsSchema = mongoose.Schema({
    descripcion: {
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
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    subtipo_actividad: { //gamagrafía o inspección
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
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    descripcion: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    tipo: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    cliente: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    fecha_inicio: {
        type: Date,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    fecha_fin: {
        type: Date,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },

    items: [itemsSchema],

    unidades: [unidadesSchema],

    certificantes: [certificantesSchema],

})





//creación model
contractsShema.pre("save", function (next) {
    // this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("contracts", contractsShema)