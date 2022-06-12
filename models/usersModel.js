const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

//Subshema donde se definen las columnas del Parte Diario
const parteColumnsShema = mongoose.Schema({
    id: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    numeric: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    disablePadding: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    label: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    width: {
        type: Number,
        default: 200
    },
    show: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    placeHolder: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    type: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
})

//USERS schema
const usersShema = mongoose.Schema({
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
    email: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        unique: true
    },
    numero_orden: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: "Inspector",
        enum: ["Administrador", "Supervisor", "Inspector", "Asistente"],
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    area: {
        type: String,
        default: "Inspección",
    },
    password: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [6, errorMessage.GENERAL.min_length]
    },
    active: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    deleted: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    policy: {
        type: Boolean,
        enum: [true, false],
        default: false
    },

    parteColumns: [parteColumnsShema],
    image: {
        type: String,
    },
})
//creación model
usersShema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("users", usersShema)