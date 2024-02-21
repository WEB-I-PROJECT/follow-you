const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../../controllers/AnalyticByKeywordGroupController');

router.get('/word/:id', new AnalyticByKeywordGroupController().tokenizeApi);
router.get('/word/chart', new AnalyticByKeywordGroupController().tokensCharts)
router.get('/news/:type/:id', new AnalyticByKeywordGroupController().getNewsApi)

// TO DO
//router.get('/:id', new AnalyticByKeywordGroupController().indexApi); - É de Durval
router.get('/sentiment/analysis/:id', new AnalyticByKeywordGroupController().sentimentAnalysisApi)
router.get('/news-sentiment/:id', new AnalyticByKeywordGroupController().newsSentimentApi)

module.exports = router;