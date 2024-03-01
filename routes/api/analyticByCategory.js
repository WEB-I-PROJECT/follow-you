const express = require('express');
const router = express.Router();
const AnalyticByCategoryController = require('../../controllers/AnalyticByCategoryController');
const { verifyToken } = require('../../controllers/AuthController');


//router.get('/:id', new AnalyticByCategoryController().index);
router.get('/news/:category/:analytic', verifyToken, new AnalyticByCategoryController().newsApi);
router.get('/tokenize/:id', verifyToken, new AnalyticByCategoryController().tokenizeApi);
router.get('/word/chart', verifyToken, new AnalyticByCategoryController().tokensCharts)


module.exports = router;