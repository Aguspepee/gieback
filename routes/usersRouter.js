var express = require('express');
var router = express.Router();

const usersController = require("../controllers/usersController.js")

/* GET users listing. */
router.get('/', usersController.getAll);
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('./islogged', usersController.islogged)

module.exports = router;

