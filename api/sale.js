const router = require("express").Router();
const { NULL } = require("mysql8/lib/protocol/constants/types");
const { nanoid } = require("nanoid");
const conn = require("../database/db");

router.post("/new_product", async (req, res) => {
  let { generic_name, description, units, date, re_order_qty, re_order_unit } =
    req.body;
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
    `SELECT * FROM products_tbl WHERE product_generic_name = ?`,
    [generic_name],
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured. Try Again" });
      } else {
        first_res.length > 0
          ? res.send({
              data: "This product, Already exists.",
              status: false,
            })
          : conn.query(
              `INSERT INTO products_tbl SET ?`,
              {
                product_generic_name: generic_name,
                product_description_name: description || " ",
                product_units: JSON.stringify(units_arr),
                product_qty: 0,
                product_date: date,
                product_re_order:
                  parseInt(re_order_qty) *
                    units_arr[units_arr.length - 1].qty || 0,
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

router.get("/customers", (req, res) => {
  conn.query("SELECT * FROM customers_tbl", (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

router.post("/new_customer", async (req, res) => {
  let { surname, first_name, phone_contact, type, address } = req.body;
  conn.query(
    `INSERT INTO customers_tbl SET ?`,
    {
      customer_surname: surname,
      customer_lastname: first_name,
      customer_phonenumber: phone_contact,
      customer_type: type,
      customer_address: address || "Not Specified",
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
  let {
    total_amount,
    discount,
    pay_amount,
    products_sold,
    date,
    user,
    customer,
  } = req.body;
  products_sold.forEach((e) => {
    let id = parseInt(e.product_id);
    conn.query(
      `SELECT * FROM products_tbl WHERE product_id = ?`,
      id,
      (pdt_err, pdt_res) => {
        if (pdt_err) {
          res.send({
            data: "An Error Occured. Refresh And Try Again",
            status: false,
          });
          throw pdt_err;
        } else {
          let units = JSON.parse(pdt_res[0].product_units);
          if (units[0].selling_unit === e.selling_unit) {
            batch_index();
            let sum = 0;
            function batch_index() {
              conn.query(
                `SELECT batch_qty, batch_id FROM batch_tbl 
                  WHERE product_id = ?  LIMIT ${1}`,
                id,
                (batch_err, batch_res) => {
                  if (batch_err) {
                    res.send({
                      data: "An Error Occured. Refresh And Try Again",
                      status: false,
                    });
                    throw batch_err;
                  } else {
                    sum += batch_res[0].batch_qty;
                    if (parseInt(e.qty) < sum) {
                      conn.query(
                        `UPDATE batch_tbl SET ? WHERE batch_id = ?`,
                        [
                          {
                            batch_qty: sum - parseInt(e.qty),
                          },
                          batch_res[0].batch_id,
                        ],
                        (err) => {
                          if (err) {
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                    }
                    if (parseInt(e.qty) == sum) {
                      conn.query(
                        `DELETE FROM batch_tbl 
                            WHERE batch_id = ?`,
                        batch_res[0].batch_id,
                        (err, result) => {
                          if (err) {
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                    }
                    if (parseInt(e.qty) > sum) {
                      conn.query(
                        `DELETE FROM batch_tbl 
                            WHERE batch_id = ?`,
                        batch_res[0].batch_id,
                        (err) => {
                          if (err) {
                            console.log(err);
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                      batch_index();
                    }
                  }
                }
              );
            }
            conn.query(
              `UPDATE products_tbl SET ? WHERE product_id = ?`,
              [
                {
                  product_qty: pdt_res[0].product_qty - parseInt(e.qty),
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
          } else {
            let unit_qty =
              parseInt(
                units.find((i) => i.selling_unit === e.selling_unit).qty
              ) * parseInt(e.qty);
            batch_index();
            let sum = 0;
            function batch_index() {
              conn.query(
                `SELECT batch_qty, batch_id FROM batch_tbl 
                  WHERE product_id = ?  LIMIT ${1}`,
                id,
                (batch_err, batch_res) => {
                  if (batch_err) {
                    res.send({
                      data: "An Error Occured. Refresh And Try Again",
                      status: false,
                    });
                    throw batch_err;
                  } else {
                    sum += batch_res[0].batch_qty;
                    if (unit_qty < sum) {
                      conn.query(
                        `UPDATE batch_tbl SET ? WHERE batch_id = ?`,
                        [
                          {
                            batch_qty: sum - unit_qty,
                          },
                          batch_res[0].batch_id,
                        ],
                        (err) => {
                          if (err) {
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                    }
                    if (unit_qty == sum) {
                      conn.query(
                        `DELETE FROM batch_tbl 
                            WHERE batch_id = ?`,
                        batch_res[0].batch_id,
                        (err, result) => {
                          if (err) {
                            console.log(err);
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                    }
                    if (unit_qty > sum) {
                      conn.query(
                        `DELETE FROM batch_tbl 
                            WHERE batch_id = ?`,
                        batch_res[0].batch_id,
                        (err) => {
                          if (err) {
                            console.log(err);
                            res.send({
                              data: "An  Error Occured. Refresh And Try Again",
                              status: false,
                            });
                          }
                        }
                      );
                      batch_index();
                    }
                  }
                }
              );
            }
            conn.query(
              `UPDATE products_tbl SET ? WHERE product_id = ?`,
              [
                {
                  product_qty: pdt_res[0].product_qty - unit_qty,
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
      customer_id: parseInt(customer) || NULL,
    },
    (insert_err, insert_res) => {
      if (insert_err) {
        console.log(insert_err);
        res.send({
          data: "An  Error Occured. Refresh And Try Again",
          status: false,
        });
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
                  let batch_id = nanoid(4);
                  conn.query(
                    `SELECT * FROM batch_tbl WHERE batch_id = ?`,
                    batch_id,
                    (err_bat, res_bat) => {
                      if (err_bat) {
                        console.log(err_bat);
                        res.send({ data: "An Error Occured", status: false });
                      } else {
                        res_bat.length === 0
                          ? conn.query(
                              `INSERT INTO batch_tbl SET ?`,
                              {
                                batch_id: batch_id,
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
                            )
                          : conn.query(
                              `INSERT INTO batch_tbl SET ?`,
                              {
                                batch_id: nanoid(4),
                                product_id: parseInt(e.product_id),
                                batch_no: e.batch_no,
                                batch_qty: parseInt(e.qty),
                                batch_expiry_date: e.expiry_date,
                              },
                              (bat_err, bat_res) => {
                                if (bat_err) {
                                  console.log(bat_err);
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
                  let batch_id = nanoid(4);
                  conn.query(
                    `SELECT * FROM batch_tbl WHERE batch_id = ?`,
                    batch_id,
                    (err_bat, res_bat) => {
                      if (err_bat) {
                        console.log(err_bat);
                        res.send({ data: "An Error Occured", status: false });
                      } else {
                        res_bat.length === 0
                          ? conn.query(
                              `INSERT INTO batch_tbl SET ?`,
                              {
                                batch_id: batch_id,
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
                            )
                          : conn.query(
                              `INSERT INTO batch_tbl SET ?`,
                              {
                                batch_id: nanoid(4),
                                product_id: parseInt(e.product_id),
                                batch_no: e.batch_no,
                                batch_qty: unit_qty,
                                batch_expiry_date: e.expiry_date,
                              },
                              (bat_err, bat_res) => {
                                if (bat_err) {
                                  console.log(bat_err);
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

//selects product for edit

router.get("/product/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM products_tbl 
    WHERE product_id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send(result);
      }
    }
  );
});
//selects product for edit

router.post("/edit_product/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM products_tbl WHERE product_id = ?`,
    req.params.id,
    (err_first, res_first) => {
      if (err_first) {
        console.log(err_first);
        res.send({ data: "An Error Occured", status: false });
      } else {
        let { generic_name, description, units, re_order_qty } = req.body;
        let units_arr = [];
        for (let i = 0; i < units.length; i++) {
          let unit = units[i];
          if (unit.qty && unit.selling_unit) {
            if (i === 0) {
              units_arr.push(unit);
            } else {
              unit.qty =
                parseInt(units_arr[i - 1].qty) * parseInt(units[i].qty);
              units_arr.push(unit);
            }
          }
        }
        conn.query(
          `UPDATE products_tbl SET ? WHERE product_id = ?`,
          [
            {
              product_generic_name: generic_name,
              product_description_name: description || " ",
              product_units: JSON.stringify(units_arr),
              product_re_order:
                parseInt(re_order_qty) * units_arr[units_arr.length - 1].qty ||
                0,
            },
            parseInt(req.params.id),
          ],

          (err, result) => {
            if (err) {
              console.log(err);
              res.send({
                data: "An Error Occured. Try Again",
                status: false,
              });
            } else {
              res.send({
                data: "Product Updated....",
                status: true,
              });
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
