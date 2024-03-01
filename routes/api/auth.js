
const express = require('express');
const router = express.Router();
const { AuthController } = require('../../controllers/AuthController');

router.post('/', new AuthController().login);

module.exports = router;


