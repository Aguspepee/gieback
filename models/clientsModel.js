const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")


//creación schema
const clientsSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        unique: true,
    },
    direccion: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
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

module.exports = mongoose.model("clients", clientsSchema)