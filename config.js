/** Common config for bookstore. */

const DB_NAME = (process.env.NODE_ENV === "test")
  ? "books-test"
  : "books";


module.exports = { DB_NAME };