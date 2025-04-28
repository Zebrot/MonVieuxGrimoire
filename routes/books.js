const express = require('express');
const router = express.Router();
const booksController = require('../controller/books');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()}).single('image');

const sharp = require('../middleware/sharp-config')

router.post('/', auth, upload, sharp, booksController.createBook);
router.post('/:id/rating', auth, booksController.rateBook);

router.get('/', booksController.getAllBooks);
router.get('/bestrating',  booksController.getBestRatings);
router.get('/:id', booksController.getOneBook);

router.put('/:id', auth, upload, sharp, booksController.updateBook);

router.delete('/:id', auth, booksController.deleteBook);


module.exports = router;