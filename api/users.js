const router = require("express").Router();
const conn = require("../database/db");

router.get("/suppliers", async (req, res) => {
  conn.query(`SELECT * FROM suppliers_tbl`, (err1, res1) => {
    if (err1) throw err1;
    res.send(res1);
  });
});

router.get("/products", async (req, res) => {
  conn.query(
    `select * from products_tbl order by product_generic_name`,
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.get("/sales", async (req, res) => {
  conn.query(`SELECT * FROM sales_tbl`, (err1, res1) => {
    if (err1) throw err1;
    res.send(res1);
  });
});

router.get("/purchases", async (req, res) => {
  conn.query(`SELECT * FROM purchases_tbl`, (err1, res1) => {
    if (err1) throw err1;
    res.send(res1);
  });
});

router.get("/units", async (req, res) => {
  conn.query(
    `SELECT * FROM 
  selling_units_tbl ORDER BY unit_name`,
    (err_first, res_first) => {
      if (err_first) throw err_first;
      res.send(res_first);
    }
  );
});

router.get("/product/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM products_tbl 
    WHERE product_id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.get("/batch/expiry", (req, res) => {
  conn.query(
    `select * from batch_tbl 
      join products_tbl 
      on batch_tbl.product_id = products_tbl.product_id`,
    (err, result) => {
      if (err) {
        res.send([]);
        throw err;
      } else {
        let days_arr = [];
        result.forEach((el) => {
          let expiry_diff = new Date(el.batch_expiry_date) - Date.now();
          let diff_days = expiry_diff / (1000 * 60 * 60 * 24);
          if (diff_days <= 90) {
            days_arr.push(el);
          }
        });
        res.send(days_arr);
      }
    }
  );
});

router.get("/my_sales/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM sales_tbl WHERE sale_made_by = ?`,
    req.params.id,
    (err_first, res_first) => {
      if (err_first) throw err_first;
      res.send(res_first);
    }
  );
});

router.get("/less_qty", (req, res) => {
  conn.query(
    // "select * from products_tbl order by product_qty,product_generic_name limit 15",
    `SELECT * FROM products_tbl 
        WHERE
      product_re_order >= product_qty 
        ORDER BY product_generic_name LIMIT 15`,
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/delete/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM batch_tbl WHERE product_id =?`,
    req.params.id,
    (err_first, res_first) => {
      if (err_first) {
        console.log(err_first);
        res.send({ data: "An Error Occured", status: false });
      } else {
        if (res_first > 0) {
          conn.query(
            `DELETE FROM batch_tbl WHERE product_id=?`,
            req.params.id,
            (del_err, del_res) => {
              if (del_err) {
                console.log(del_err);
                res.send({ data: "An Error Occured", status: false });
              } else {
                conn.query(
                  `DELETE FROM products_tbl WHERE product_id =?`,
                  req.params.id,
                  (first_err, first_res) => {
                    if (first_err) {
                      console.log(first_err);
                      res.send({ data: "An Error Occured", status: false });
                    } else {
                      res.send({ data: "Deleting Successful", status: true });
                    }
                  }
                );
              }
            }
          );
        } else {
          conn.query(
            `DELETE FROM products_tbl WHERE product_id =?`,
            req.params.id,
            (err, result) => {
              if (err) {
                console.log(first_err);
                res.send({ data: "An Error Occured", status: false });
              } else {
                res.send({ data: "Deleting Successful", status: true });
              }
            }
          );
        }
      }
    }
  );
});

router.get("/batches", async (req, res) => {
  conn.query(
    `SELECT * FROM batch_tbl 
  JOIN products_tbl ON batch_tbl.product_id = products_tbl.product_id`,
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.get("/delete_batch/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM batch_tbl WHERE batch_id = ?`,
    req.params.id,
    (err_first, res_first) => {
      if (err_first) {
        console.log(err_first);
        res.send({ data: "An Error Occured", status: false });
      } else {
        conn.query(
          `SELECT * FROM products_tbl WHERE product_id = ?`,
          res_first[0].product_id,
          (error, result) => {
            if (error) {
              console.log(error);
              res.send({ data: "An Error occured", status: false });
            } else {
              conn.query(
                `UPDATE products_tbl SET ? WHERE product_id = ?`,
                [
                  {
                    product_qty: result[0].product_qty - res_first[0].batch_qty,
                  },
                  res_first[0].product_id,
                ],
                (err, first_res) => {
                  if (err) {
                    console.log(err);
                    res.send({ data: "An Error occured", status: false });
                  } else {
                    conn.query(
                      `DELETE FROM batch_tbl WHERE batch_id =?`,
                      req.params.id,
                      (err1, res1) => {
                        if (err1) {
                          console.log(err1);
                          res.send({ data: "An Error occured", status: false });
                        } else {
                          res.send({
                            data: "Batch Number Successfully Removed",
                            status: true,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.get("/search_batch/:id", async (req, res) => {
  let pattern = /\W/g;
  let check = pattern.test(req.params.id);
  if (check === true) {
    res.send([]);
    return;
  } else {
    conn.query(
      `SELECT products_tbl.product_id,product_generic_name,product_description_name,
      batch_tbl.batch_qty,batch_tbl.batch_no,batch_tbl.batch_id
       FROM products_tbl JOIN
      batch_tbl ON batch_tbl.product_id=products_tbl.product_id 
      WHERE batch_no LIKE '%${req.params.id}%'`,
      req.params.id,
      (first_err, first_res) => {
        if (first_err) throw first_err;
        res.send(first_res);
      }
    );
  }
});

module.exports = router;
