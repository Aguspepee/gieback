var express = require('express');
var router = express.Router();

const usersController = require("../controllers/usersController.js")

/* GET users listing. */
router.get('/', usersController.getAll);
router.get('/list', usersController.getList);
router.get('/names', usersController.getNames);
router.get('/one/:id', usersController.getOne);

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/whoami', usersController.whoami)

router.put('/edit/:id', usersController.edit);

router.delete('/:id', usersController.delete);

module.exports = router;

