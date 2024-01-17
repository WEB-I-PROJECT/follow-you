const express = require('express');
const router = express.Router();
const AnalyticByKeywordsController = require('../controllers/AnalyticByKeywordsController');

router.get('/', new AnalyticByKeywordsController().index);
router.post('/pesquisa', new AnalyticByKeywordsController().search);

module.exports = router;