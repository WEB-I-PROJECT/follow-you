const express = require('express');
const router = express.Router();
const AnalyticByCategoryController = require('../../controllers/AnalyticByCategoryController');

//router.get('/:id', new AnalyticByCategoryController().index);
router.get('/news/:category/:analytic', new AnalyticByCategoryController().newsApi);
router.get('/tokenize/:id', new AnalyticByCategoryController().tokenizeApi);
router.get('/word/chart', new AnalyticByCategoryController().tokensCharts)


module.exports = router;