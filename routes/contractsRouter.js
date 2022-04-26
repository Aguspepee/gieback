var express = require('express');
var router = express.Router();

const contractsController = require("../controllers/contractsController.js")

/* GET users listing. */
router.get('/', contractsController.getAll);
router.post('/', contractsController.createContract);

module.exports = router;