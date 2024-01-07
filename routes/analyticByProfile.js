const express = require('express');
const router = express.Router();
const AnalyticByProfileController = require('../controllers/AnalyticByProfileController');

router.get('/', new AnalyticByProfileController().index);

module.exports = router;