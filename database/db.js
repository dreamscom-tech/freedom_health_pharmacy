const mysql = require("mysql8");

const MYSQL_CONFIG = {
  host: "34.72.23.161",
  user: "app_user",
  password: "dreamscom@256",
  database: "freedom_health_db_secure",
  socketPath: "/cloudsql/rxplus-project:us-central1:rxplus-instance",
  // socketPath: "/cloudsql/hospitalsystem-318608:us-central1:hospitalsystem",
};

const conn = mysql.createConnection(MYSQL_CONFIG);
conn.connect((err) => {
  if (err) throw err;
  console.log("Database Connected...");
});

module.exports = conn;
