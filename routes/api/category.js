const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/CategoryController');

router.get('/', new CategoryController().indexApi);
router.get('/delete/:id', new CategoryController().delete);
router.get('/details/:id', new CategoryController().details);

module.exports = router;