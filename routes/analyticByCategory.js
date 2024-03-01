const express = require('express');
const router = express.Router();
const {loggedUser} = require('../helpers/loggedUser');

const AnalyticByCategoryController = require('../controllers/AnalyticByCategoryController');

router.get('/:id', loggedUser, new AnalyticByCategoryController().index);
router.get('/news/:category/:analytic', loggedUser, new AnalyticByCategoryController().news);
router.get('/tokenizar/:id', loggedUser, new AnalyticByCategoryController().tokenize);
router.get('/tokens/grafico', loggedUser, new AnalyticByCategoryController().tokensCharts)


module.exports = router;