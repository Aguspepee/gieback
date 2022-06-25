const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")

//creación schema
const settingsSchema = mongoose.Schema({
    nombre: {
        type: String,
        default: "GIE S.A.",
    },
    CUIT:{
        type: String,
        default: "30-69001149-9",
    },
    direccion: {
        type: String,
        default:"Galicia N° 52, Mar del Plata, Buenos Aires (7600)",
    },
    telefono:{
        type: String,
        default:"(+54) 0223-482-2308"
    },
    fax:{
        type: String,
        default:"(+54) 0223-482-2308"
    },
    web:{
        type: String,
        default:"www.giegroup.net"
    },
    email: {
        type: String,
        default:""
    },
    abreviatura: {
        type: String,
        default: "GIE",
    },
    image: {
        type: String,
        maxlength: [3, errorMessage.GENERAL.min_length]
    },
})

//creación model
module.exports = mongoose.model("settings", settingsSchema)