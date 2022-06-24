var express = require('express');
var router = express.Router();

const partesController = require("../controllers/partesController.js")

/* GET partes listing. */
router.get('/', partesController.getAll);
router.get('/one/:id', partesController.getOne)
router.get('/restricted', partesController.getRestricted);
router.get('/unrestricted', partesController.getUnrestricted);

router.post('/create', partesController.create);
router.post('/masiva', partesController.masiva);

router.put('/edit/:id', partesController.edit);

router.delete('/:id', partesController.delete);
router.delete('/many/:selected', partesController.deleteMany);


module.exports = router;

