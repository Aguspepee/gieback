const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")


//creación schema
const clientsShema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length],
        unique: true,
    },
    direccion: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    email: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        //unique: true
    },
    telefono: { 
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    abreviatura: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        maxlength: [3, errorMessage.GENERAL.min_length]
    },

    deleted: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    active: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    image: {
        type: String,
        maxlength: [3, errorMessage.GENERAL.min_length]
    },
})
//creación model

module.exports = mongoose.model("clients", clientsShema)