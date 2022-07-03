var express = require('express');
var router = express.Router();

const certificadosController = require("../controllers/certificadosController.js")

/* GET */
router.get('/', certificadosController.getAll);
router.get('/numero', certificadosController.number); 

router.put('/:selected', certificadosController.create);
router.put('/estado/:selected', certificadosController.estado);

router.delete('/:selected', certificadosController.delete);

module.exports = router;
 