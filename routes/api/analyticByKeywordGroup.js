const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../../controllers/AnalyticByKeywordGroupController');
const { verifyToken } = require('../../controllers/AuthController');


router.get('/word/:id', verifyToken, new AnalyticByKeywordGroupController().tokenizeApi);
router.get('/word/chart',verifyToken, new AnalyticByKeywordGroupController().tokensCharts)
router.get('/news/:type/:id', verifyToken, new AnalyticByKeywordGroupController().getNewsApi)
router.get('/sentiment/analysis/:id', verifyToken, new AnalyticByKeywordGroupController().sentimentAnalysisApi)
router.get('/news/sentiment/:id', verifyToken, new AnalyticByKeywordGroupController().newsSentimentApi)

module.exports = router;