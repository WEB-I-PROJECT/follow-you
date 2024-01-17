const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {loggedUser} = require("../helpers/loggedUser")




router.get('/', new UserController().index);
router.get('/login',new UserController().login);
router.post('/login', new UserController().auth);
router.get('/registro', new UserController().viewRegister);
router.post('/registro', new UserController().register);
router.get('/registro/login', loggedUser, new UserController().login);
router.get('/logout', loggedUser, new UserController().logout);






module.exports = router;