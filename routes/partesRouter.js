var express = require('express');
var router = express.Router();

const partesController = require("../controllers/partesController.js")

/* GET partes listing. */
router.get('/', partesController.getAll);
router.get('/restricted', partesController.getRestricted);
router.get('/unrestricted', partesController.getUnrestricted);

router.post('/create', partesController.create);

router.put('/edit/:id', partesController.edit);

router.delete('/:id', partesController.delete);

module.exports = router;

