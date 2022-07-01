var express = require('express');
var router = express.Router();

const certificadosController = require("../controllers/certificadosController.js")

/* GET */
router.get('/', certificadosController.getAll);

router.put('/:selected', certificadosController.create);

router.delete('/:selected', certificadosController.delete);

module.exports = router;
 