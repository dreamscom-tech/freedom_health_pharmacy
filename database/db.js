const mysql = require("mysql8");

const MYSQL_CONFIG = {
  host: "35.226.114.255",
  user: "dreamscom",
  password: "dreamscom@256",
  database: "rxplus_db",
  // socketPath: "/cloudsql/hospitalsystem-318608:us-central1:hospitalsystem",
};

const conn = mysql.createConnection(MYSQL_CONFIG);
conn.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

module.exports = conn;
