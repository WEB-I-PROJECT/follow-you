const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/', new AnalyticByKeywordGroupController().index);

module.exports = router;