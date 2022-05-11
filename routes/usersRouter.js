var express = require('express');
var router = express.Router();
const upload = require('../config/multer')
const usersController = require("../controllers/usersController.js")

/* GET users listing. */
router.get('/', usersController.getAll);
router.get('/list', usersController.getList);
router.get('/names', usersController.getNames);
router.get('/one/:id', usersController.getOne);

router.post('/register', upload.single('userImage'), usersController.register);
router.post('/login', usersController.login);
router.post('/whoami', usersController.whoami);
//router.post('/image', upload.single('userImage'), usersController.image);

router.put('/edit/:id', usersController.edit);
router.put('/image/:id', upload.single('userImage'), usersController.image);

router.delete('/:id', usersController.delete);

module.exports = router;

