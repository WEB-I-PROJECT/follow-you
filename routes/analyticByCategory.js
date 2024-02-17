const express = require('express');
const router = express.Router();
const AnalyticByCategoryController = require('../controllers/AnalyticByCategoryController');

router.get('/:id', new AnalyticByCategoryController().index);
router.get('/news/:id', new AnalyticByCategoryController().news);

module.exports = router;