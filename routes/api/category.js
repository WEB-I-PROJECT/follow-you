const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/CategoryController');

router.get('/', new CategoryController().indexApi);
router.delete('/:id', new CategoryController().delete);
router.get('/:id', new CategoryController().details);

module.exports = router;