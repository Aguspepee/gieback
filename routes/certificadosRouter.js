var express = require('express');
var router = express.Router();

const certificadosController = require("../controllers/certificadosController.js")

/* GET */
router.get('/', certificadosController.getAll);

module.exports = router;
