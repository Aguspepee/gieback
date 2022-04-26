const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")

const unidadesSchema = mongoose.Schema({
    nombre: {
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

    unidades: [unidadesSchema]
})





//creación model
contractsShema.pre("save", function (next) {
    // this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("contracts", contractsShema)