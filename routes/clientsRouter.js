var express = require('express');
var router = express.Router();

const clientsController = require("../controllers/clientsController.js")

/* GET clients listing. */
router.get('/', clientsController.getAll);
router.get('/names', clientsController.getNames);
router.get('/one/:id', clientsController.getOne);

router.post('/', clientsController.create); 

router.put('/edit/:id', clientsController.edit);
 
router.delete('/:id', clientsController.delete);

module.exports = router;

