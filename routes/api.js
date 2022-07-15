const express = require('express');

// include controller
const booksController = require('../controller/BooksController');

const router = express.Router();

// Add all api based routes here
router.post('/books', booksController.fetchBooksData);

module.exports = router;