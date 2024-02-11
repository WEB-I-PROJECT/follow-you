const express = require('express');
const router = express.Router();
const AnalyticByKeywordGroupController = require('../controllers/AnalyticByKeywordGroupController');

router.get('/:id', new AnalyticByKeywordGroupController().index);
router.get('/tokenizar/:id', new AnalyticByKeywordGroupController().tokenize);
router.get('/noticias/:type/:id', new AnalyticByKeywordGroupController().getNews)
router.get('/sentiment_analysis/:id', new AnalyticByKeywordGroupController().sentimentAnalysis)


module.exports = router;