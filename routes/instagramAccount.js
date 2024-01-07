const express = require('express');
const router = express.Router();
const InstagramAccountController = require('../controllers/InstagramAccountController');

router.get('/', new InstagramAccountController().index);

module.exports = router;