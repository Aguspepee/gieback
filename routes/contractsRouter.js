var express = require('express');
var router = express.Router();

const contractsController = require("../controllers/contractsController.js")

/* GET users listing. */
router.get('/', contractsController.getAll); 
router.get('/list', contractsController.getList);
router.get('/names', contractsController.getNames);
router.post('/', contractsController.create);
router.put('/edit/:id', contractsController.edit);
router.delete('/:id', contractsController.delete);

module.exports = router;