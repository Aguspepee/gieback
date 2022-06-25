var express = require('express');
var router = express.Router();

const settingsController = require("../controllers/settingsController.js")

/* GET */
router.get('/', settingsController.getAll);

/* GET */
router.post('/', settingsController.create);



module.exports = router;