var express = require('express');
var router = express.Router();

const remitosController = require("../controllers/remitosController.js")

/* GET */
router.get('/', remitosController.getAll);
router.get('/numero', remitosController.number);

router.put('/:selected', remitosController.create);

module.exports = router;
