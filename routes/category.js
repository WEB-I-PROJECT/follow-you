const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');
const path = require('path');
const {isAdmin} = require('../helpers/isAdmin');

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

router.get('/', isAdmin, new CategoryController().index);
router.post('/create', isAdmin,  upload.single('imgPath'), new CategoryController().create);
router.post('/edit', isAdmin, upload.single('imgPath'), new CategoryController().edit);
router.get('/delete/:id', isAdmin, new CategoryController().delete);
router.get('/details/:id', isAdmin, new CategoryController().details);

module.exports = router;