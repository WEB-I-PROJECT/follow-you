const express = require('express');
const router = express.Router();
const ClientProfileController = require('../controllers/ClientProfileController');

router.get('/', new ClientProfileController().index);

module.exports = router;