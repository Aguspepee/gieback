var express = require('express');
var router = express.Router();

const partesController = require("../controllers/partesController.js")

/* GET */
router.get('/', partesController.getAll);

module.exports = router;
