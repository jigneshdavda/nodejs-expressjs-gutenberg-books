// include imports
const constants = require('../util/constants');
const helper = require('../util/helper');

// include model imports
const booksModel = require('../model/Books');

exports.fetchBooksData = async (req, res, next) => {
    const booksData = await booksModel.get_filtered_books(req.body);
    return helper.successResponse(res, constants.BOOKS_SUCCESSFULL_LISTED, booksData, 200);
};