const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {loggedUser} = require("../helpers/loggedUser");
const {isAdmin} = require('../helpers/isAdmin');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });


router.get('/', new UserController().index);
router.get('/sobre', new UserController().about);
router.get('/login',new UserController().login);
router.post('/login', new UserController().auth);
router.get('/registro', new UserController().viewRegister);
router.post('/registro', new UserController().register);
router.get('/registro/login', loggedUser, new UserController().login);
router.get('/logout', loggedUser, new UserController().logout);
router.post('/edit', loggedUser, upload.single('profile_picture'), new UserController().edit);

//painel de admin
router.get('/admin', isAdmin, new UserController().list);
router.get('/listar-aprovados',isAdmin, new UserController().listAll);
router.post('/approve-user/:userId', isAdmin, new UserController().approveUser);
router.post('/deny-user/:userId', isAdmin, new UserController().denyUser);
 
module.exports = router;