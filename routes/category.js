const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.get('/', new CategoryController().index);
router.get('/add', new CategoryController().add);
router.post('/create', new CategoryController().create);
router.get('/delete/:id', new CategoryController().delete);

module.exports = router;