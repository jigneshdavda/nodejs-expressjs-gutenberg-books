// import database from database.js
const db = require("../util/database");

async function filtering_books(formData) {
  // Declare string for query
  let filterQuery = "";

  // Check values for below params

  // Check for book_number
  if (formData.book_number.trim() != '') {
    let tempNumber = formData.book_number.split(",");
    tempNumber = tempNumber.join("','");
    filterQuery +=
      "(SELECT id FROM `books_book` WHERE gutenberg_id IN (" +
      ("'" + tempNumber + "'") +
      ") ) UNION ";
  }

  // Check for language
  if (formData.language.trim()) {
    let tempLang = formData.language.split(",");
    tempLang = tempLang.join("','");
    filterQuery +=
      "(SELECT bbl.book_id as id FROM `books_language` AS bl, `books_book_languages` AS bbl WHERE bl.id = bbl.language_id AND bl.code IN (" +
      ("'" + tempLang + "'") +
      ") ) UNION ";
  }

  // Check for mime_type
  if (formData.mime_type.trim()) {
    filterQuery +=
      "(SELECT book_id as id FROM `books_format` WHERE mime_type LIKE '%" +
      formData.mime_type +
      "%' ) UNION ";
  }

  // Check for author
  if (formData.author.trim()) {
    filterQuery +=
      "(SELECT bba.book_id as od FROM `books_author` as ba, `books_book_authors` as bba WHERE ba.id = bba.author_id AND ba.name LIKE '%" +
      formData.author +
      "%' ) UNION ";
  }

  // Check for book_title
  if (formData.title.trim()) {
    filterQuery +=
      "(SELECT id FROM `books_book` WHERE title LIKE '%" +
      formData.title +
      "%' ) UNION ";
  }

  // Check for topic
  if (formData.topic.trim()) {
    filterQuery +=
      "(SELECT bbb.book_id as id FROM `books_bookshelf` as bb, `books_book_bookshelves` as bbb WHERE bb.id = bbb.bookshelf_id AND bb.name LIKE '%" +
      formData.topic +
      "%' ) UNION ";
    filterQuery +=
      "(SELECT bbs.book_id as id FROM `books_subject` as bs, `books_book_subjects` as bbs WHERE bs.id = bbs.subject_id AND bs.name LIKE '%" +
      formData.topic +
      "%' )";
  }

  // Remove extra UNION from string
  if (
    filterQuery.trim().substring(filterQuery.trim().lastIndexOf(" ")).trim() ===
    "UNION"
  ) {
    filterQuery = filterQuery
      .trim()
      .substring(0, filterQuery.trim().lastIndexOf(" "));
  } else {
    filterQuery = filterQuery;
  }

  // Check for filterQuery empty string
  var filteredResults = "";
  if (filterQuery) {
    filterQuery += " LIMIT " + formData.limit;

    // Execute DB query
    await db
      .execute(filterQuery)
      .then(([rows, fields]) => {
        filteredResults = rows;

        if (filteredResults) {
          // Parse book id from the result
          let tempResult = "";
          for (let result of filteredResults) {
            tempResult += result.id + ",";
          }
          // remove last comma from string and send data
          filteredResults = tempResult
            .trim()
            .substring(0, tempResult.trim().lastIndexOf(","));
        } else {
          filteredResults = "";
        }
      })
      .catch((err) => console.log("FilterQuery DB error: ", err));
  } else {
    filteredResults = "";
  }

  return get_books_info(filteredResults, formData.limit);
}

async function get_books_info(filteredBookIds, limit) {
  if (filteredBookIds) {
    whereQuery = " WHERE id IN (" + filteredBookIds + ") ";
  } else {
    whereQuery = "";
  }

  let bookQuery =
    "SELECT id, title, gutenberg_id FROM books_book " +
    whereQuery +
    " limit " +
    limit;

  // Execute DB query
  var bookResults = [];
  await db
    .execute(bookQuery)
    .then(([rows, fields]) => {
      bookResults = rows;
    })
    .catch((err) => console.log("BookQuery DB error: ", err));

  result = [];

  for (let item of bookResults) {
    item["author_info"] = await get_author_info(item.id);
    item["language"] = await get_language_info(item.id);
    item["subjects"] = await get_subjects_info(item.id);
    item["book_shelves"] = await get_book_shelfs_info(item.id);
    item["book_formats"] = await get_book_formats(item.id);
    result.push(item);
  }

  return result;
}

async function get_author_info(bookId) {
  let authorQuery =
    "SELECT name, birth_year, death_year FROM `books_book_authors` as bba, `books_author` as ba WHERE bba.author_id = ba.id AND book_id = " +
    bookId;

  // execute db query
  let authorResults = [];
  await db
    .execute(authorQuery)
    .then(([rows, fields]) => {
      authorResults = rows;
    })
    .catch((err) => console.log(err));

  return authorResults;
}

async function get_language_info(bookId) {
  let languageQuery =
    "SELECT bl.id as id, code FROM `books_book_languages` as bbl, `books_language` as bl WHERE bbl.language_id = bl.id AND bbl.book_id = " +
    bookId;

  // execute db query
  let languageResults = [];
  await db
    .execute(languageQuery)
    .then(([rows, fields]) => {
      languageResults = rows;
    })
    .catch((err) => console.log(err));

  return languageResults;
}

async function get_subjects_info(bookId) {
  let subjectsQuery =
    "SELECT bs.id as id, name FROM `books_book_subjects` as bbs, `books_subject` as bs WHERE bbs.subject_id = bs.id AND bbs.book_id = " +
    bookId;

  // execute db query
  let subjectsResults = [];
  await db
    .execute(subjectsQuery)
    .then(([rows, fields]) => {
      subjectsResults = rows;
    })
    .catch((err) => console.log(err));

  return subjectsResults;
}

async function get_book_shelfs_info(bookId) {
  let book_shelfsQuery =
    "SELECT bb.id as id, name FROM `books_book_bookshelves` as bbb, `books_bookshelf` as bb WHERE bbb.bookshelf_id = bb.id AND bbb.book_id = " +
    bookId;

  // execute db query
  let book_shelfsResults = [];
  await db
    .execute(book_shelfsQuery)
    .then(([rows, fields]) => {
      book_shelfsResults = rows;
    })
    .catch((err) => console.log("Error: ", err));

  return book_shelfsResults;
}

async function get_book_formats(bookId) {
  let formatQuery =
    "SELECT id, mime_type, url FROM `books_format` WHERE book_id = " + bookId;

  // execute db query
  let formatResults = [];
  await db
    .execute(formatQuery)
    .then(([rows, fields]) => {
      formatResults = rows;
    })
    .catch((err) => console.log(err));

  return formatResults;
}

exports.get_filtered_books = filtering_books;
