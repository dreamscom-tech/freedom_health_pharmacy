const router = require("express").Router();
const conn = require("../database/db");

router.post("/login", async (req, res) => {
  res.send({ status: true, user: { username: req.body.username } });
  // conn.query(
  //   `SELECT * FROM users_tbl WHERE username = ? AND user_password = ?`,
  //   [req.body.username, req.body.password],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       res.send({ status: false });
  //     } else {
  //       result.length == 0
  //         ? res.send({ status: false })
  //         : res.send({ status: true, user: result[0] });
  //     }
  //   }
  // );
});

router.post("/new_user", async (req, res) => {
  let {
    surname,
    first_name,
    username,
    gender,
    phone_contact,
    role,
    password,
    confirm_password,
  } = req.body;
  conn.query(
    `SELECT * FROM users_tbl WHERE username = ?`,
    [username],
    (err1, res1) => {
      if (err1) {
        console.log(err1);
        res.send({ data: "An Error Occurred", status: false });
      } else {
        if (res1.length > 0) {
          res.send({ data: "Username Already Taken", status: false });
        } else {
          if (password !== confirm_password) {
            res.send({ data: "Passwords Do not Match", status: false });
          } else {
            if (password.length < 5) {
              res.send({
                data: "Password Should be atleast 5 characters",
                status: false,
              });
            } else {
              conn.query(
                `INSERT INTO users_tbl SET ?`,
                {
                  user_surname: surname,
                  user_first_name: first_name,
                  user_phone_number: phone_contact,
                  username: username,
                  user_role: role,
                  user_gender: gender,
                  user_password: password,
                },
                (err2, res2) => {
                  if (err2) {
                    console.log(err2);
                    res.send({ status: false });
                  } else {
                    res.send({ data: "User Added Successfully", status: true });
                  }
                }
              );
            }
          }
        }
      }
    }
  );
});

router.post("/new_unit", async (req, res) => {
  conn.query(
    `SELECT * FROM selling_units_tbl WHERE unit_name = ?`,
    req.body.unit_name,
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured. Try Again", status: false });
      } else {
        first_res.length === 0
          ? conn.query(
              `INSERT INTO selling_units_tbl SET ?`,
              {
                unit_name: req.body.unit_name,
              },
              (err_first, res_first) => {
                if (err_first) {
                  console.log(err_first);
                  res.send({
                    data: "An Error Occured. Try Again",
                    status: false,
                  });
                } else {
                  res.send({ data: "Unit Added Successfully", status: true });
                }
              }
            )
          : res.send({ data: "Unit Already Exists", status: false });
      }
    }
  );
});

module.exports = router;
