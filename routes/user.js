const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {loggedUser} = require("../helpers/loggedUser");
const {isAdmin} = require('../helpers/isAdmin');


router.get('/', new UserController().index);
router.get('/login',new UserController().login);
router.post('/login', new UserController().auth);
router.get('/registro', new UserController().viewRegister);
router.post('/registro', new UserController().register);
router.get('/registro/login', loggedUser, new UserController().login);
router.get('/logout',  new UserController().logout);

//painel de admin
router.get('/admin', isAdmin, new UserController().list);
router.get('/listar-aprovados', isAdmin, new UserController().listAll);
router.post('/approve-user/:userId', isAdmin, new UserController().approveUser);
router.post('/deny-user/:userId', isAdmin, new UserController().denyUser);





module.exports = router;