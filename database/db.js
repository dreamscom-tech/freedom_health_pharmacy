const path = require("path");
const fs = require("fs");
const mysql = require("mysql8");

const MYSQL_CONFIG = {
  host: "38.17.53.113",
  user: "admin",
  password: "YGJTOBYf",
  database: "fhp",
  port: 16662,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
  },
};

const conn = mysql.createConnection(MYSQL_CONFIG);
conn.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

module.exports = conn;
