var express = require('express');
var router = express.Router();

const contractsController = require("../controllers/contractsController.js")

/* GET users listing. */
router.get('/', contractsController.getAll); 
router.get('/list', contractsController.getList);
router.get('/names', contractsController.getNames);
router.get('/one/:id', contractsController.getOne);


router.post('/', contractsController.create);
router.post('/empty', contractsController.empty); //Crea contrato vacio

router.put('/edit/:id', contractsController.edit);

router.delete('/:id', contractsController.delete);


module.exports = router;