const express = require('express');
const router = express.Router();

const analyticApi = require('./routes/api/analytic');
const analyticByKeywordGroupApi = require('./routes/api/analyticByKeywordGroup');
const userApi = require('./routes/api/user.js');


router.use('/api/analytic/by-keywords/', analyticByKeywordGroupApi);
router.use('/api/analytic/', analyticApi);

//users
router.use('/api/user/' , userApi )
module.exports = router;
