var express = require('express');
var router = express.Router();


const inicioController = require("../controllers/inicioController.js")

/* GET users listing. */
router.get('/inspector/:id', inicioController.getIndicadoresInspector);  

module.exports = router;