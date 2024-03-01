const express = require('express');
const router = express.Router();
const AnalyticController = require('../../controllers/AnalyticController');
const { verifyToken } = require('../../controllers/AuthController');


router.delete('/:id', verifyToken, new AnalyticController().removeApi);
router.get('/:userId',verifyToken, new AnalyticController().indexApi);
router.post('/', verifyToken, new AnalyticController().saveAnalyticApi);

module.exports = router;