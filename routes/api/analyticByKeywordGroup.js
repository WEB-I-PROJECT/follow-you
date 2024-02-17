const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../../controllers/AnalyticByKeywordGroupController');

router.get('/word/:id', new AnalyticByKeywordGroupController().tokenizeApi);
router.get('/word/chart', new AnalyticByKeywordGroupController().tokensCharts)
router.get('/news/:type/:id', new AnalyticByKeywordGroupController().getNewsApi)

// TO DO
// router.get('/:id', new AnalyticByKeywordGroupController().index);
// router.get('/sentimento/analise/:id', new AnalyticByKeywordGroupController().sentimentAnalysis)
// router.get('/noticias-sentimento/:id', new AnalyticByKeywordGroupController().newsSentiment)

module.exports = router;