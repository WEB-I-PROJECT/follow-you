const express = require('express');
const router = express.Router();
const AnalyticController = require('../../controllers/AnalyticController');
const {loggedUser} = require('../../helpers/loggedUser');

router.delete('/:id', new AnalyticController().removeApi);
//funciona

// TO DO
router.get('/:userId', new AnalyticController().indexApi);
router.post('/save-analytic', new AnalyticController().saveAnalyticApi);

module.exports = router;