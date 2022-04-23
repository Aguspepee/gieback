var express = require('express');
var router = express.Router();

const usersController = require("../controllers/usersController.js")

/* GET users listing. */
router.get('/', usersController.getAll);
router.post('/', usersController.create);
router.post('/login', usersController.login);

module.exports = router;

