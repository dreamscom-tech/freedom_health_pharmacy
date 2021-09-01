const router = require("express").Router();
const conn = require("../database/db");

//printer

//printer

router.post("/new_product", async (req, res) => {
  let { generic_name, description, units, date } = req.body;
  let units_arr = [];
  for (let i = 0; i < units.length; i++) {
    let unit = units[i];
    if (unit.qty && unit.selling_unit) {
      if (i === 0) {
        units_arr.push(unit);
      } else {
        unit.qty = parseInt(units_arr[i - 1].qty) * parseInt(units[i].qty);
        units_arr.push(unit);
      }
    }
  }
  conn.query(
    `SELECT * FROM products_tbl WHERE product_generic_name = ? 
    AND product_description_name = ?`,
    [generic_name, description],
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured. Try Again" });
      } else {
        first_res.length > 0
          ? res.send({
              data: "This product and description. Already exists.",
              status: false,
            })
          : conn.query(
              `INSERT INTO products_tbl SET ?`,
              {
                product_generic_name: generic_name,
                product_description_name: description,
                product_units: JSON.stringify(units_arr),
                product_qty: 0,
                product_date: date,
              },
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.send({
                    data: "An Error Occured. Try Again",
                    status: false,
                  });
                } else {
                  res.send({
                    data: "Product Added Successfully",
                    status: true,
                  });
                }
              }
            );
      }
    }
  );
});

router.post("/new_supplier", async (req, res) => {
  let {
    supplier_surname,
    supplier_lastname,
    supplier_contact,
    supplier_location,
    supplier_address,
    date,
  } = req.body;
  conn.query(
    `SELECT * FROM suppliers_tbl WHERE supplier_surname = ?`,
    [supplier_surname],
    (err1, res1) => {
      if (err1) {
        console.log(err1);
        res.send({ data: "Error Occured. Try Again", status: false });
      } else {
        conn.query(
          `INSERT INTO suppliers_tbl SET ?`,
          {
            supplier_surname: supplier_surname,
            supplier_lastname: supplier_lastname,
            supplier_contact: supplier_contact,
            supplier_location: supplier_location,
            date_registered: date,
          },
          (err, result) => {
            if (err) {
              console.log(err);
              res.send({ data: "Error Occured", status: false });
            } else {
              res.send({ data: "Supplier Added", status: true });
            }
          }
        );
      }
    }
  );
});

router.post("/new_customer", async (req, res) => {
  let { surname, first_name, phone_contact, type, address, location } =
    req.body;
  conn.query(
    `INSERT INTO customers_tbl SET ?`,
    {
      customer_surname: surname,
      customer_lastname: first_name,
      customer_phonenumber: phone_contact,
      customer_type: type,
      customer_address: address,
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ data: "Error Occured. Try Again", status: false });
      } else {
        res.send({ data: "Customer Added", status: true });
      }
    }
  );
});

router.post("/new_sale", async (req, res) => {
  let { total_amount, discount, pay_amount, products_sold, date, user } =
    req.body;
  products_sold.forEach((e) => {
    let id = parseInt(e.product_id);
    conn.query(
      `SELECT * FROM products_tbl WHERE product_id = ?`,
      id,
      (err_first, res_first) => {
        if (err_first) {
          console.log(err_first);
          res.send({ data: "An Error Occured. Try Again", status: false });
        } else {
          let units = JSON.parse(res_first[0].product_units);
          if (units[0].selling_unit === e.selling_unit) {
            conn.query(
              `SELECT * FROM batch_tbl WHERE product_id = ${id} LIMIT ${parseInt(
                e.product_batch_index
              )}`,
              (batch_err, batch_res) => {
                if (batch_err) {
                  console.log(batch_err);
                  res.send({
                    data: "An Error Occured. Try Again",
                    status: false,
                  });
                } else {
                  let qty = 0;
                  let qty_diff = 0;
                  for (let j = 0; j < batch_res.length; j++) {
                    qty += batch_res[j].batch_qty;
                    if (qty <= parseInt(e.qty)) {
                      let _qty = batch_res[j].batch_qty - parseInt(e.qty);
                      qty_diff += _qty;
                      conn.query(
                        `DELETE FROM batch_tbl WHERE batch_id=?`,
                        batch_res[j].batch_id,
                        (err, results) => {
                          if (err) {
                            console.log(err);
                            res.send({
                              data: "An Error Occured. Try Again",
                              status: false,
                            });
                          } else {
                            conn.query(
                              `UPDATE products_tbl SET ? WHERE product_id = ?`,
                              [
                                {
                                  product_qty:
                                    qty > 0
                                      ? res_first[0].product_qty - qty
                                      : res_first[0].product_qty + qty,
                                },
                                id,
                              ],
                              (err5, res5) => {
                                if (err5) {
                                  console.log(err5);
                                  res.send({
                                    data: "An Error Occured. Try Again",
                                    status: false,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (qty > parseInt(e.qty)) {
                      conn.query(
                        `UPDATE batch_tbl SET ? WHERE batch_id = ?`,
                        [
                          {
                            batch_qty:
                              qty_diff !== 0
                                ? batch_res[j].batch_qty + qty_diff
                                : batch_res[j].batch_qty - parseInt(e.qty),
                          },
                          batch_res[j].batch_id,
                        ],
                        (err6, res6) => {
                          if (err6) {
                            console.log(err6);
                            res.send({
                              data: "An Error Occured. Try Again",
                              status: false,
                            });
                          } else {
                            conn.query(
                              `UPDATE products_tbl SET ? WHERE product_id = ?`,
                              [
                                {
                                  product_qty:
                                    res_first[0].product_qty - parseInt(e.qty),
                                },
                                id,
                              ],
                              (err5, res5) => {
                                if (err5) {
                                  console.log(err5);
                                  res.send({
                                    data: "An Error Occured. Try Again",
                                    status: false,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                }
              }
            );
          } else {
            let unit_qty =
              parseInt(
                units.find((i) => i.selling_unit === e.selling_unit).qty
              ) * parseInt(e.qty);
            conn.query(
              `SELECT * FROM batch_tbl WHERE product_id = ${id} LIMIT ${parseInt(
                e.product_batch_index
              )}`,
              (unit_err, unit_res) => {
                if (unit_err) {
                  console.log(unit_err);
                  res.send({
                    data: "An Error Occured. Try Again",
                    status: false,
                  });
                } else {
                  let new_qty = 0;
                  let new_qty_diff = 0;
                  for (let x = 0; x < unit_res.length; x++) {
                    new_qty += unit_res[x].batch_qty;
                    if (new_qty <= unit_qty) {
                      let qty_ = unit_res[x].batch_qty - parseInt(e.qty);
                      new_qty_diff += qty_;
                      conn.query(
                        `DELETE FROM batch_tbl WHERE batch_id=?`,
                        unit_res[x].batch_id,
                        (_err, _results) => {
                          if (_err) {
                            console.log(_err);
                            res.send({
                              data: "An Error Occured. Try Again",
                              status: false,
                            });
                          } else {
                            conn.query(
                              `UPDATE products_tbl SET ? WHERE product_id = ?`,
                              [
                                {
                                  product_qty:
                                    new_qty < 0
                                      ? res_first[0].product_qty + new_qty
                                      : res_first[0].product_qty - new_qty,
                                },
                                id,
                              ],
                              (_err5, _res5) => {
                                if (_err5) {
                                  console.log(_err5);
                                  res.send({
                                    data: "An Error Occured. Try Again",
                                    status: false,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (new_qty > unit_qty) {
                      conn.query(
                        `UPDATE batch_tbl SET ? WHERE batch_id = ?`,
                        [
                          {
                            batch_qty:
                              new_qty_diff !== 0
                                ? unit_res[x].batch_qty + new_qty
                                : unit_res[x].batch_qty - unit_qty,
                          },
                          unit_res[x].batch_id,
                        ],
                        (_err6, _res6) => {
                          if (_err6) {
                            console.log(_err6);
                            res.send({
                              data: "An Error Occured. Try Again",
                              status: false,
                            });
                          } else {
                            conn.query(
                              `UPDATE products_tbl SET ? WHERE product_id = ?`,
                              [
                                {
                                  product_qty:
                                    res_first[0].product_qty - unit_qty,
                                },
                                id,
                              ],
                              (_err5, _res5) => {
                                if (_err5) {
                                  console.log(_err5);
                                  res.send({
                                    data: "An Error Occured. Try Again",
                                    status: false,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                }
              }
            );
          }
        }
      }
    );
  });
  conn.query(
    `INSERT INTO sales_tbl SET ?`,
    {
      products_sold: JSON.stringify(products_sold),
      sales_amount: parseFloat(total_amount),
      sales_discount: parseFloat(discount) || 0,
      amount_paid: parseFloat(pay_amount),
      sales_date: date,
      sale_made_by: user,
    },
    (insert_err, insert_res) => {
      if (insert_err) {
        console.log(insert_err);
        res.send({ data: "An  Error Occured. Try Again", status: false });
      } else {
        res.send({ data: "Sale Completed Successfully.", status: true });
      }
    }
  );
});

router.post("/new_purchase", async (req, res) => {
  let { total_amount, discount, pay_amount, products_purchased, date, user } =
    req.body;
  products_purchased.forEach((e) => {
    let id = parseInt(e.product_id);
    conn.query(
      `SELECT * FROM products_tbl WHERE product_id = ? `,
      [id],
      (f_err, f_res) => {
        if (f_err) {
          console.log(f_err);
          res.send({ data: "An Error Occured", status: false });
        } else {
          let units = JSON.parse(f_res[0].product_units);
          if (units[0].selling_unit === e.selling_unit) {
            let qty = parseInt(e.qty) + f_res[0].product_qty;
            conn.query(
              `UPDATE products_tbl SET ? WHERE product_id = ?`,
              [
                {
                  product_qty: qty,
                },
                f_res[0].product_id,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.send({ data: "Error Occured.Try Again", status: false });
                } else {
                  conn.query(
                    `INSERT INTO batch_tbl SET ?`,
                    {
                      product_id: parseInt(e.product_id),
                      batch_no: e.batch_no,
                      batch_qty: parseInt(e.qty),
                      batch_expiry_date: e.expiry_date,
                    },
                    (err_batch, res_batch) => {
                      if (err_batch) {
                        console.log(err_batch);
                        res.send({
                          data: "An Error Occured. Try Again",
                          status: false,
                        });
                      }
                    }
                  );
                }
              }
            );
          } else {
            let unit_qty =
              parseInt(
                units.find((i) => i.selling_unit === e.selling_unit).qty
              ) * parseInt(e.qty);
            let qty = parseInt(f_res[0].product_qty) + unit_qty;

            conn.query(
              `UPDATE products_tbl SET ? WHERE product_id = ?`,
              [
                {
                  product_qty: qty,
                },
                f_res[0].product_id,
              ],
              (err3, res3) => {
                if (err3) {
                  console.log(err3);
                  res.send({ data: "An Error Occured", status: false });
                } else {
                  conn.query(
                    `INSERT INTO batch_tbl SET ?`,
                    {
                      product_id: parseInt(e.product_id),
                      batch_no: e.batch_no,
                      batch_qty: unit_qty,
                      batch_expiry_date: e.expiry_date,
                    },
                    (err_batch, res_batch) => {
                      if (err_batch) {
                        console.log(err_batch);
                        res.send({
                          data: "An Error Occured. Try Again",
                          status: false,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  });
  conn.query(
    `INSERT INTO purchases_tbl SET ?`,
    {
      products_purchased: JSON.stringify(products_purchased),
      purchase_discount: parseFloat(discount) || 0,
      purchase_amount: parseFloat(pay_amount),
      purchase_t_amount: parseFloat(total_amount),
      purchase_made_by: user,
      purchase_date: date,
    },
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured", status: false });
      } else {
        res.send({ data: "Purchase Finished Successfully", status: true });
      }
    }
  );
});

router.post("/edit_product/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM products_tbl WHERE product_id = ?`,
    req.params.id,
    (err_first, res_first) => {
      if (err_first) {
        console.log(err_first);
        res.send({ data: "An Error Occured", status: false });
      } else {
        conn.query(
          `UPDATE products_tbl SET ? WHERE product_id =?`,
          [
            {
              product_generic_name: req.body.trade_name,
              product_generic_name: req.body.generic_name,
              product_description_name: req.body.description,
              product_units:
                req.body.units.length === 0
                  ? res_first[0].product_units
                  : req.body.units,
            },
            req.params.id,
          ],
          (first_err, first_res) => {
            if (first_err) {
              console.log(first_err);
              res.send({ data: "An Error Occured. Try Again", status: false });
            } else {
              res.send({ data: "Product Updated Successfully", status: true });
            }
          }
        );
      }
    }
  );
});

router.get("/products/:id", async (req, res) => {
  let pattern = /\W/g;
  let check = pattern.test(req.params.id);
  if (check === true) {
    res.send([]);
    return;
  } else {
    conn.query(
      `select * from products_tbl where 
      product_generic_name like '%${req.params.id}%'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  }
});

router.get("/batch/:id/:index", async (req, res) => {
  conn.query(
    `select sum(batch_qty) as sum,batch_id from batch_tbl 
      where product_id = ${req.params.id} group by batch_id
        limit ${req.params.index};`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;
