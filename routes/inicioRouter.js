var express = require('express');
var router = express.Router();


const inicioController = require("../controllers/inicioController.js")

/* GET users listing. */
router.get('/administrador/', inicioController.getIndicadoresAdministrador);  
router.get('/supervisor/', inicioController.getIndicadoresSupervisor);  
router.get('/inspector/:id', inicioController.getIndicadoresInspector);  
router.get('/asistente/', inicioController.getIndicadoresAsistente);

module.exports = router;