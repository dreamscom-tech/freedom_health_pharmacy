const express = require("express");
const cors = require("cors");
const conn = require("./database/db");
const PORT = process.env.PORT || 5050;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user/admin/", require("./api/admin"));
app.use("/api/user/all/", require("./api/users"));
app.use("/api/user/sale/", require("./api/sale"));

app.use(express.static("client/build"));

app.use(function (req, res, next) {
  res.status(404);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
