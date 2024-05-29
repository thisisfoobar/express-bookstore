process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let booksList;
let book1;
let book2;
let book3 = {
  isbn: "3",
  amazon_url: "http://a.co/eobPtX2",
  author: "Test3",
  language: "English",
  pages: 789,
  publisher: "Test Publisher3",
  title: "Test Book3",
  year: 2020,
};
let badBook = {
  isbn: "3",
  amazon_url: "http://a.co/eobPtX2",
  author: 2532345,
  language: "English",
  publisher: "Test Publisher3",
  title: "Test Book3",
  year: 2020,
};
let updateBook2 = {
  amazon_url: "http://a.co/eobPtX2",
  author: "UpdateTest2",
  language: "English",
  pages: 623,
  publisher: "Test Publisher2",
  title: "Test Book2",
  year: 2020,
};
let badUpdateBook1 = {
    amazon_url: 129301,
    author: "Test",
    language: "English",
    pages: 123,
    title: "Test Book Revised",
    year: 2026,
  }

describe("Test User routes", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");
    book1 = await Book.create({
      isbn: "1",
      amazon_url: "http://a.co/eobPtX2",
      author: "Test",
      language: "English",
      pages: 123,
      publisher: "Test Publisher",
      title: "Test Book",
      year: 2024,
    });
    book2 = await Book.create({
      isbn: "2",
      amazon_url: "http://a.co/eobPtX2",
      author: "Test2",
      language: "English",
      pages: 456,
      publisher: "Test Publisher2",
      title: "Test Book2",
      year: 2020,
    });
    booksList = [book1, book2];
  });

  /* Get all books */
  test("get all books", async function () {
    let res = await request(app).get("/books");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ books: booksList });
  });

  /* Get a single book */
  test("get a single book", async function () {
    let res = await request(app).get("/books/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ book: book1 });
  });

  /* Book not found */
  test("get wrong book", async function () {
    let res = await request(app).get("/books/3");
    expect(res.statusCode).toBe(404);
  });

  /* Create new book */
  test("create new book", async function () {
    let res = await request(app).post("/books").send(book3);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ newBook: book3 });
  });

  /* Create bad book */
  test("create new book", async function () {
    let res = await request(app).post("/books").send(badBook);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: [
          'instance requires property "pages"',
          "instance.author is not of a type(s) string",
        ],
        status: 400,
      },
      message: [
        'instance requires property "pages"',
        "instance.author is not of a type(s) string",
      ],
    });
  });

  /* Update book */
  test("update book", async function () {
    let res = await request(app).put("/books/2").send(updateBook2);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updatedBook: {
        isbn: "2",
        amazon_url: "http://a.co/eobPtX2",
        author: "UpdateTest2",
        language: "English",
        pages: 623,
        publisher: "Test Publisher2",
        title: "Test Book2",
        year: 2020,
      },
    });
  });

  /* Bad update */
  test("bad update of book", async function() {
    let res = await request(app).put("/books/1").send(badUpdateBook1)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({
        error: {
            message: [
              'instance requires property "publisher"',
              "instance.amazon_url is not of a type(s) string",
            ],
            status: 400,
          },
          message: [
            'instance requires property "publisher"',
            "instance.amazon_url is not of a type(s) string",
          ],
    })
  })

  /* delete book */
  test("delete a book", async function() {
    let res = await request(app).delete("/books/1")

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({message: "Book deleted"})
  })
});

afterAll(async function () {
  await db.end();
});
