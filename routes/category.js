const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../hub-news/public/imgCategory');  // Especifique o caminho onde deseja armazenar as imagens
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext); 
  }
});

const upload = multer({ storage: storage });

router.get('/', new CategoryController().index);
router.get('/buscar/:id', new CategoryController().search);
router.post('/create', upload.single('imgPath'), new CategoryController().create);
router.get('/delete/:id', new CategoryController().delete);
router.get('/details/:id', new CategoryController().details);
router.post('/addProfile/:id', new CategoryController().addProfile);
router.delete('/deleteProfile/:id', new CategoryController().deleteProfile);

module.exports = router;