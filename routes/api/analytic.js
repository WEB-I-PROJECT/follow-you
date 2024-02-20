const express = require('express');
const router = express.Router();
const AnalyticController = require('../../controllers/AnalyticController');
const {loggedUser} = require('../../helpers/loggedUser');

router.delete('/:id', new AnalyticController().removeApi);

// TODO
// router.get('/', loggedUser, new AnalyticController().index);
// router.get('/add', loggedUser, new AnalyticController().add);
// router.post('/add/nova', loggedUser, new AnalyticController().saveAnalytic);

module.exports = router;