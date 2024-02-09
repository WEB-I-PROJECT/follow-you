const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/:id', new AnalyticByKeywordGroupController().index);
router.get('/tokenizar/:id', new AnalyticByKeywordGroupController().tokenize);
router.get('/noticias/:type/:id', new AnalyticByKeywordGroupController().getNews)
router.post('/tokens/grafico', new AnalyticByKeywordGroupController().tokensCharts)

module.exports = router;