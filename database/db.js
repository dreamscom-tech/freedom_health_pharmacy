const path = require("path");
const fs = require("fs");
const mysql = require("mysql8");

// const MYSQL_CONFIG = {
//   host: "35.184.138.218",
//   user: "dreamscom",
//   password: "",
//   database: "fhp",
//   socketPath: "/cloudsql/freedom-health-pharmacy:us-central1:rxplus-instances",
// };
const MYSQL_CONFIG = {
  host: "209.209.40.87",
  user: "admin",
  password: "8mpe3IlQ",
  database: "freedom_health_db_secure",
  port: 19877,
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
