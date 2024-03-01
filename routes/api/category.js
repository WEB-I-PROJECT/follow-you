const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/CategoryController');
const { verifyToken } = require('../../controllers/AuthController');

router.get('/', verifyToken, new CategoryController().indexApi);
router.delete('/:id', verifyToken, new CategoryController().delete);
router.get('/:id', verifyToken, new CategoryController().details);

module.exports = router;