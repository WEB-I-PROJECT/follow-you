
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');

router.get('/', new UserController().listUsers);
router.patch('/disable/:userId', new UserController().deactivateUser);
router.patch('/activate/:userId', new UserController().activateUser);
router.post('/', new UserController().store);
router.put('/', new UserController().update);



module.exports = router;


