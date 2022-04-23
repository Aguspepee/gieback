var express = require('express');
var router = express.Router();

const partesController = require("../controllers/partesController.js")

/* GET partes listing. */
router.get('/', partesController.getAll);
router.post('/register', partesController.register);
router.post('/login', partesController.login);
router.post('./islogged', partesController.islogged)

module.exports = router;

