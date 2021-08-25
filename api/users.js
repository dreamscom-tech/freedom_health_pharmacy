const router = require("express").Router();
const conn = require("../database/db");

router.get("/suppliers", async (req, res) => {
  conn.query(`SELECT * FROM suppliers_tbl`, (err1, res1) => {
    if (err1) throw err1;
    res.send(res1);
  });
});

router.get("/products", async (req, res) => {
  conn.query(`SELECT * FROM products_tbl`, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
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
  selling_units_tbl`,
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
    "select * from products_tbl order by product_qty limit 25",
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
});
module.exports = router;
