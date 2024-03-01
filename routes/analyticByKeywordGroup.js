const express = require('express');
const router = express.Router();
const {loggedUser} = require('../helpers/loggedUser');

const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/:id', loggedUser, new AnalyticByKeywordGroupController().index);
router.get('/tokenizar/:id', loggedUser, new AnalyticByKeywordGroupController().tokenize);
router.get('/noticias/:type/:id',loggedUser, new AnalyticByKeywordGroupController().getNewsTemplate)
router.get('/sentimento/analise/:id', loggedUser, new AnalyticByKeywordGroupController().sentimentAnalysis)
router.get('/tokens/grafico', loggedUser, new AnalyticByKeywordGroupController().tokensCharts)
router.get('/noticias-sentimento/:id', loggedUser, new AnalyticByKeywordGroupController().newsSentiment)

module.exports = router;