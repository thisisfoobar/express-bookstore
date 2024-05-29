/** Database config for database. */


const { Client } = require("pg");
const {DB_NAME} = require("./config");
const password = require("./secretpassword");


let db = new Client({
  user: "thisisfoobar",
  host: "localhost",
  database: DB_NAME,
  password: password,
  port: 5432,
});

db.connect();


module.exports = db;
