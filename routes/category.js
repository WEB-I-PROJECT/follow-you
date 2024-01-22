const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');
const upload = multer({ dest: '/pathUploads' });

router.get('/', new CategoryController().index);
router.post('/create', upload.single('imgPath'), new CategoryController().create);
router.get('/delete/:id', new CategoryController().delete);
router.get('/details/:id', new CategoryController().details);
router.post('/addProfile/:id', new CategoryController().addProfile);
router.delete('/deleteProfile/:id', new CategoryController().deleteProfile);
module.exports = router;