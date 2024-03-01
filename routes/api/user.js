
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const { AuthController } = require('../../controllers/AuthController');
const { verifyToken } = require('../../controllers/AuthController');


router.get('/', verifyToken, new UserController().listUsers);
router.patch('/disable/:userId', verifyToken, new UserController().deactivateUser);
router.patch('/activate/:userId', verifyToken, new UserController().activateUser);
router.post('/', verifyToken, new UserController().store);
router.put('/', verifyToken, new UserController().update);

module.exports = router;


