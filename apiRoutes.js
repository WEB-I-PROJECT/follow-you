const express = require('express');
const router = express.Router();

const analyticApi = require('./routes/api/analytic');
const analyticByKeywordGroupApi = require('./routes/api/analyticByKeywordGroup');

router.use('/api/analytic/by-keywords/', analyticByKeywordGroupApi);
router.use('/api/analytic/', analyticApi);

module.exports = router;
