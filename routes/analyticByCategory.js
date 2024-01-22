const express = require('express');
const router = express.Router();
const AnalyticByCategoryController = require('../controllers/AnalyticByCategoryController');

router.get('/', new AnalyticByCategoryController().index);

module.exports = router;