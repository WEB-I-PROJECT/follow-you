const express = require('express');
const router = express.Router();
const AnalyticByKeywordsController = require('../controllers/AnalyticByKeywordsController');

router.get('/', new AnalyticByKeywordsController().index);

module.exports = router;