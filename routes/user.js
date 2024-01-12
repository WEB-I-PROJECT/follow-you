const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', new UserController().index);
router.get('/login', new UserController().login);
router.get('/register', new UserController().register);

module.exports = router;