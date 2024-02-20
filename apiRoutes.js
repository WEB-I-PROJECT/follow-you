const express = require('express');
const router = express.Router();

const analyticApi = require('./routes/api/analytic');
const analyticByKeywordGroupApi = require('./routes/api/analyticByKeywordGroup');
const analyticByCategoryApi = require('./routes/api/analyticByCategory');
const categoryApi = require('./routes/api/category');


router.use('/api/analytic/by-keywords/', analyticByKeywordGroupApi);
router.use('/api/analytic/by-category/', analyticByCategoryApi);
router.use('/api/category/', categoryApi);
router.use('/api/analytic/', analyticApi);

module.exports = router;
