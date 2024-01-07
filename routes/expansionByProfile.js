const express = require('express');
const router = express.Router();
const ExpansionByProfileController = require('../controllers/ExpansionByProfileController');

router.get('/', new ExpansionByProfileController().index);

module.exports = router;