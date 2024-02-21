
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');

router.get('/list-users', new UserController().listUsers);
router.post('/disable-user/:userId', new UserController().deactivateUser);
router.post('/activate-user/:userId', new UserController().activateUser);
router.post('/add-user', new UserController().store);
router.post('/edit-user', new UserController().update);



module.exports = router;


