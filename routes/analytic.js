const express = require('express');
const router = express.Router();
const AnalyticController = require('../controllers/AnalyticController');

router.get('/', new AnalyticController().index);

module.exports = router;