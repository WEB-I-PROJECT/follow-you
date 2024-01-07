const express = require('express');
const router = express.Router();
const ExpansionByCategoryController = require('../controllers/ExpansionByCategoryController');

router.get('/', new ExpansionByCategoryController().index);

module.exports = router;