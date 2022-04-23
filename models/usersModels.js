const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

//creación schema
const usersShema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    lastName: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    email: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        unique: true
    },
    role: {
        type: String,
        default: "Inspector",
        enum: ["Administrador", "Supervisor", "Inspector", "Asistente"],
        required: [true, errorMessage.GENERAL.campo_obligatorio],
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
})
//creación model
usersShema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("users", usersShema)