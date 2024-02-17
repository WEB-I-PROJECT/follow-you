const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/:id', new AnalyticByKeywordGroupController().index);
router.get('/tokenizar/:id', new AnalyticByKeywordGroupController().tokenize);
router.get('/noticias/:type/:id', new AnalyticByKeywordGroupController().getNews)
router.get('/sentimento/analise/:id', new AnalyticByKeywordGroupController().sentimentAnalysis)
router.post('/tokens/grafico', new AnalyticByKeywordGroupController().tokensCharts)
router.get('/noticias-sentimento/:id', new AnalyticByKeywordGroupController().newsSentiment)


module.exports = router;