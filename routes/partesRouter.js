var express = require('express');
var router = express.Router();

const partesController = require("../controllers/partesController.js")

/* GET partes listing. */
router.get('/', partesController.getAll);

router.post('/create', partesController.create);

module.exports = router;

