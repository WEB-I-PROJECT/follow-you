const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/:id', new AnalyticByKeywordGroupController().index);
router.get('/tokenizar/:id', new AnalyticByKeywordGroupController().tokenize);

module.exports = router;