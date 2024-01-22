const express = require('express');
const router = express.Router();
const KeywordGroupController = require('../controllers/KeywordGroupController');

router.get('/', new KeywordGroupController().index);

module.exports = router;