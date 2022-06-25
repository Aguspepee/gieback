const settingsModel = require("../models/settingsModel")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await settingsModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    create: async function (req, res, next) {
        console.log("entro")
        try {
            const settings = new settingsModel
            const document = await settings.save()
            console.log("se creó", document)
            res.json(document);
        } catch (e) {
            console.log(e.message)
            e.status = 400
            next(e)
        }
    },
}