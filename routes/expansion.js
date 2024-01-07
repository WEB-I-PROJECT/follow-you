const express = require('express');
const router = express.Router();
const ExpansionController = require('../controllers/ExpansionController');

router.get('/', new ExpansionController().index);

module.exports = router;