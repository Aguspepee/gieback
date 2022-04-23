const usersModel = require("../models/usersModels")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await usersModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    login: async function (req, res, next) {
        try {
            const user = await usersModel.findOne({ email: req.body.email })
            if (!user) {
                return res.json({ error: true, message: "Email incorrecto" })
            }
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ userId: user._id }, req.app.get("secretKey"), { expiresIn: "1h" })
                return res.json({ error: false, message: "Se inició sesión" , token: token, user:user })
            } else {
                return res.json({ error: true, message: "Contraseña incorrecta" })
            }
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        try {
            const user = new usersModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                role: req.body.roles,
                active: req.body.active,
                deleted: req.body.deleted,
                policy: req.body.policy
            })
            const document = await user.save()
            console.log("se creó", document)
            res.status(201).json(document);
        } catch (e) { 
            console.log(e)
            e.status = 400
            next(e)
        }
    }
}
