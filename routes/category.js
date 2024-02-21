const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const categoryImagePath = path.join(path.resolve(process.cwd()), 'public', 'category', 'imgCategory',);
    cb(null, categoryImagePath);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext); 
  }
});

const upload = multer({ storage: storage });

router.get('/', new CategoryController().index);
router.post('/create', upload.single('imgPath'), new CategoryController().create);
router.post('/edit', upload.single('imgPath'), new CategoryController().edit);
router.get('/delete/:id', new CategoryController().delete);
router.get('/details/:id', new CategoryController().details);

module.exports = router;