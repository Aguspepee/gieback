var express = require('express');
var router = express.Router();

const remitosController = require("../controllers/remitosController.js")

/* GET */
router.get('/', remitosController.getAll);

module.exports = router;
