var express = require('express');
var router = express.Router();

const clientsController = require("../controllers/clientsController.js")

/* GET clients listing. */
router.get('/', clientsController.getAll);
router.get('/names', clientsController.getNames);
router.post('/', clientsController.create);

module.exports = router;

