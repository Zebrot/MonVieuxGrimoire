const express = require('express');
const router = express.Router();
const booksController = require('../controller/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');



router.post('/', auth, multer, booksController.createBook);
router.post('/:id/rating', auth, booksController.rateBook);

router.get('/', booksController.getAllBooks);
router.get('/bestrating',  booksController.getBestRatings);
router.get('/:id', booksController.getOneBook);

router.put('/:id', auth, multer, booksController.updateBook);

router.delete('/:id', auth, booksController.deleteBook);


module.exports = router;