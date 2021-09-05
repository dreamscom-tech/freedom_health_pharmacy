import React, { Component, useState } from "react";
import {
  TextField,
  Snackbar,
  Button,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Nav from "./components/Nav";
import Header from "./components/Header";
import FormsApi from "../../api/forms";
import UsersApi from "../../api/users";
import Autocomplete from "@material-ui/lab/Autocomplete";
import qz from "qz-tray";

//print image:
import PrintImage from "../../assets/logo_hospital.png";

//print

/* <script type="text/javascript" src="js/dependencies/rsvp-3.1.0.min.js"></script>
<script type="text/javascript" src="js/dependencies/sha-256.min.js"></script>
<script type="text/javascript" src="js/qz-tray.js"></script> */

//print

//print

import "../../design/main.css";
import "../../design/forms.css";
import "../../design/print_sale.css";
import user from "../../app_config";
import data from "../../components/raw_print";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NewSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "Please Wait...",
      messageState: "",
      print: true,
      _content: {},
      form_visible: false,
      active_product_qty: 0,
      over_qty_error: false,
      active_sale_type: "retail",
      active_selling_unit: "",
      active_selling_price: "",
      products: [],
      customers: [],
      formData: [],
      total: 0,
      discount: 0,
      finish_btn_disabled: false,
    };
    this.customers();
  }

  print_receipt = (v) => {
    qz.websocket
      .connect()
      .then(() => {
        return qz.printers.find("Generic");
      })
      .then((printer) => {
        console.log(printer);
        let config = qz.configs.create(printer);
        return qz.print(config, data.new_sale(v));
      })
      .then(() => {
        return qz.websocket.disconnect();
      })
      .then(() => {
        // process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        // process.exit(1);
      });
  };

  //date for receipt
  getDate() {
    let date =
      new Date(Date.now()).getDate() +
      " / " +
      (new Date(Date.now()).getMonth() + 1) +
      " / " +
      new Date(Date.now()).getFullYear();
    return date;
  }
  //date for receipt

  //customers
  customers = async () => {
    const res = (await UsersApi.data("/user/sale/customers")) || [];
    if (res) {
      this.setState({
        ...this.state,
        customers: res !== "Error" ? res : [],
      });
    }
  };
  //customers
  handleSale = async (e) => {
    e.preventDefault();
    if (this.state.finish_btn_disabled) return;
    this.setState({
      ...this.state,
      open: true,
      messageState: "info",
      finish_btn_disabled: true,
    });
    const fd = new FormData(e.target);
    let content = {};
    fd.forEach((value, key) => {
      content[key] = value;
    });
    await this.setState({ ...this.state, _content: content });

    if (this.state.formData.length !== 0) {
      this.setState({
        ...this.state,
        _content: {
          ...this.state._content,
          products_sold: this.state.formData,
          date: Date.now(),
          user: user.user.username,
        },
      });
    } else {
      this.setState({
        ...this.state,
        open: true,
        message: "No Products To Sell",
        messageState: "warning",
      });
      return;
    }

    let api = new FormsApi();
    let res = await api.post("/user/sale/new_sale", this.state._content);
    if (res.status === true) {
      if (this.state.print) {
        this.print_receipt(this.state._content);
      }
      this.setState({
        ...this.state,
        open: true,
        message: res.data,
        messageState: "success",
        finish_btn_disabled: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      this.setState({
        ...this.state,
        open: true,
        message: res.data,
        messageState: "error",
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.over_qty_error) {
      this.setState({
        ...this.state,
        open: true,
        messageState: "error",
        message: "Quantity Exceeds Available",
      });
      return;
    }
    if (!this.state.active_drug) {
      this.setState({
        ...this.state,
        open: true,
        messageState: "error",
        message: "No Selling Unit",
      });
      return;
    }
    this.setState({ ...this.state, open: true, messageState: "info" });
    const fd = new FormData(e.target);
    let _fcontent = {};
    fd.forEach((value, key) => {
      _fcontent[key] = value;
    });
    _fcontent["batch"] = this.state.batch ? this.state.batch : [];
    const product_name = this.state.formData.find(
      (e) => e.product_name === _fcontent.product_name
    );
    if (!product_name) {
      this.setState({
        ...this.state,
        open: true,
        message: "Product Added",
        messageState: "success",
        formData: [...this.state.formData, _fcontent],
        active_drug: null,
      });
    } else {
      this.setState({
        ...this.state,
        open: true,
        message: "Product Exists",
        messageState: "warning",
      });
    }
  };

  handleDrugNameKeyUp = async (e, v) => {
    const res = e.target.value
      ? (await UsersApi.data(`/user/sale/products/${e.target.value}`)) || []
      : [];
    if (res) {
      this.setState({ ...this.state, products: res === "Error" ? [] : res });
    }
  };

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  handleChangeDrugName = (e, v) => {
    if (v) {
      if (!this.IsJsonString(v.product_units)) {
        this.setState({
          ...this.state,
          open: true,
          message: "This Product has no Selling Units, Edit It to make a sale",
          messageState: "warning",
        });
        return;
      }
      this.setState(
        {
          ...this.state,
          active_drug: v,
        },
        () => {
          this.setState(
            {
              ...this.state,
              active_selling_unit: JSON.parse(
                this.state.active_drug.product_units
              )[0].selling_unit,
              active_selling_price: JSON.parse(
                this.state.active_drug.product_units
              )[0][this.state.active_sale_type],
            },
            () => {
              this.setState({
                ...this.state,
                active_product_qty:
                  this.state.active_selling_unit ===
                  JSON.parse(this.state.active_drug.product_units)[0]
                    .selling_unit
                    ? parseInt(this.state.active_drug.product_qty)
                    : parseInt(this.state.active_drug.product_qty) /
                      parseInt(
                        JSON.parse(this.state.active_drug.product_units).find(
                          (el) => el.selling_unit === e.target.value
                        )["qty"]
                      ),
              });
            }
          );
        }
      );
    }
  };

  getTotals() {
    let total = 0;
    if (this.state.formData.length !== 0) {
      this.state.formData.forEach((e) => {
        total += parseInt(e.product_price) * parseInt(e.qty);
      });
    }
    return total;
  }

  closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false, message: "" });
  };

  render() {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={this.state.open}
          autoHideDuration={5000}
          onClose={this.closePopUp}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.closePopUp}
              >
                <i className="las la-times"></i>
              </IconButton>
            </React.Fragment>
          }
        >
          <Alert onClose={this.closePopUp} severity={this.state.messageState}>
            {this.state.message}
          </Alert>
        </Snackbar>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="sale" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Sale List</h3>
                  <Button
                    aria-describedby={this.id}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      window.location.reload();
                    }}
                    style={{ fontSize: "17.5px", marginRight: "15px" }}
                  >
                    <span style={{ fontSize: "17.5px", marginRight: "10px" }}>
                      <i className="las la-redo"></i>
                    </span>
                    Cancel
                  </Button>
                </div>
                <div className="card-body">
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Name</td>
                        <td>Qty</td>
                        <td>Unit Price(Shs)</td>
                        <td>Total(Shs)</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.formData.length === 0 ? (
                        <tr>
                          <td>No Product Added</td>
                        </tr>
                      ) : (
                        this.state.formData.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="name_cell">{v.product_name}</td>
                              <td>{v.qty}</td>
                              <td>{v.product_price}</td>
                              <td>
                                {parseInt(v.product_price) * parseInt(v.qty)}
                              </td>
                              <td>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    let arr = this.state.formData;
                                    arr.splice(i, 1);
                                    this.setState({
                                      ...this.state,
                                      formData: arr,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <thead>
                      <tr>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td>{this.getTotals()}</td>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div className="projects">
                <form
                  className="card"
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                >
                  <div className="card-header ">
                    <div>
                      <FormControl
                        variant="outlined"
                        // label="selling_unit"
                        style={{
                          width: "85%",
                          marginInline: "20px",
                        }}
                      >
                        <InputLabel id="sale_type">Sale</InputLabel>
                        <Select
                          inputProps={{
                            name: "sale_type",
                          }}
                          label="Sale"
                          id="select_sale_type"
                          value={this.state.active_sale_type}
                          onChange={(e, v) => {
                            this.setState({
                              ...this.state,
                              active_sale_type: e.target.value,
                              active_drug: null,
                            });
                          }}
                        >
                          <MenuItem value="retail">Retail</MenuItem>
                          <MenuItem value="wholesale">Wholesale</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="">
                      <Button
                        type="submit"
                        aria-describedby={this.id}
                        variant="contained"
                        color="primary"
                      >
                        <span
                          style={{ fontSize: "17.5px", marginRight: "10px" }}
                        >
                          <i className="las la-plus-circle"></i>
                        </span>
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h4>Product Details</h4>
                        <div className="inputs_ctr">
                          <div className="inpts_on_left">
                            <Autocomplete
                              id="combo-box-demo"
                              options={this.state.products}
                              getOptionLabel={(option) =>
                                `${option.product_generic_name} ${option.product_description_name}`
                              }
                              onChange={this.handleChangeDrugName}
                              onKeyUp={this.handleDrugNameKeyUp}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search Product"
                                  name="product_name"
                                  variant="outlined"
                                />
                              )}
                            />
                            <TextField
                              disabled={this.state.active_drug ? false : true}
                              type="number"
                              name="qty_available"
                              variant="outlined"
                              label="Available"
                              value={this.state.active_product_qty}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            />
                          </div>
                          <div className="inpts_on_right">
                            <FormControl
                              variant="outlined"
                              label="selling_unit"
                              disabled={this.state.active_drug ? false : true}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="selling_unit">
                                Selling Unit
                              </InputLabel>
                              <Select
                                inputProps={{
                                  name: "selling_unit",
                                }}
                                label="Selling Unit"
                                id="select_selling_unit"
                                value={this.state.active_selling_unit}
                                onChange={async (e, v) => {
                                  await this.setState({
                                    ...this.state,
                                    active_selling_price: JSON.parse(
                                      this.state.active_drug.product_units
                                    ).find(
                                      (el) => el.selling_unit === e.target.value
                                    )[this.state.active_sale_type],
                                  });
                                  this.setState(
                                    {
                                      ...this.state,
                                      active_selling_unit: e.target.value,
                                    },
                                    () => {
                                      this.setState({
                                        ...this.state,
                                        active_product_qty:
                                          this.state.active_selling_unit ===
                                          JSON.parse(
                                            this.state.active_drug.product_units
                                          )[0].selling_unit
                                            ? parseInt(
                                                this.state.active_drug
                                                  .product_qty
                                              )
                                            : parseInt(
                                                this.state.active_drug
                                                  .product_qty
                                              ) /
                                              parseInt(
                                                JSON.parse(
                                                  this.state.active_drug
                                                    .product_units
                                                ).find(
                                                  (el) =>
                                                    el.selling_unit ===
                                                    e.target.value
                                                )["qty"]
                                              ),
                                      });
                                    }
                                  );
                                }}
                              >
                                {this.state.active_drug ? (
                                  JSON.parse(
                                    this.state.active_drug.product_units
                                  ).map((v, i) => {
                                    return (
                                      <MenuItem key={i} value={v.selling_unit}>
                                        {v.selling_unit}
                                      </MenuItem>
                                    );
                                  })
                                ) : (
                                  <MenuItem value="">No Selling Units</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                            <TextField
                              disabled={this.state.active_drug ? false : true}
                              error={this.state.over_qty_error}
                              type="number"
                              name="qty"
                              variant="outlined"
                              label="Quantity"
                              helperText={
                                this.state.over_qty_error
                                  ? "Quantity Exceeds Available"
                                  : ""
                              }
                              defaultValue={0}
                              onChange={async (e) => {
                                if (
                                  parseInt(e.target.value) >
                                  this.state.active_product_qty
                                ) {
                                  await this.setState({
                                    ...this.state,
                                    over_qty_error: true,
                                  });
                                } else {
                                  await this.setState({
                                    ...this.state,
                                    over_qty_error: false,
                                  });
                                }
                              }}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            />
                            <input
                              hidden
                              type="text"
                              name="product_id"
                              defaultValue={
                                this.state.active_drug
                                  ? this.state.active_drug.product_id
                                  : ""
                              }
                            />
                            <input
                              hidden
                              type="text"
                              name="product_price"
                              defaultValue={this.state.active_selling_price}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <form
                  className="card"
                  style={{ marginTop: "20px" }}
                  onSubmit={this.handleSale}
                >
                  <div className="card-header card-header-payments">
                    <h3 className="class_payment_header">Payment</h3>
                    <div className="">
                      <FormGroup style={{ display: "inline" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              name="print_receipt"
                              onChange={() => {
                                this.setState(
                                  {
                                    ...this.state,
                                    print: !this.state.print,
                                  },
                                  () => {
                                    console.log(this.state.print);
                                  }
                                );
                              }}
                            />
                          }
                          label="Print Receipt"
                        />
                      </FormGroup>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ marginRight: 10 }}
                        disabled={this.state.finish_btn_disabled}
                      >
                        <span
                          style={{ fontSize: "17.5px", marginRight: "10px" }}
                        >
                          <i className="las la-print"></i>
                        </span>
                        Finish Sale
                      </Button>
                    </div>
                  </div>
                  <Finish
                    t={this.getTotals()}
                    sale_type={this.state.active_sale_type}
                    customers={this.state.customers}
                  />
                  <input
                    type="text"
                    hidden
                    value={this.state.active_sale_type}
                    name="sale_type"
                  />
                </form>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
}

export default NewSale;

function Finish({ t, sale_type, customers }) {
  const [discount, setDiscount] = useState(0);
  return (
    <div className="_finish_purchase_ctr">
      <TextField
        name="total_amount"
        variant="outlined"
        label="Total"
        value={t}
        style={{
          width: "75%",
          margin: "20px",
        }}
      />
      <TextField
        name="discount"
        variant="outlined"
        label="Discount"
        type="number"
        onChange={(e) => {
          setDiscount(parseInt(e.target.value) || 0);
        }}
        style={{
          width: "75%",
          margin: "20px",
        }}
      />
      <TextField
        name="pay_amount"
        variant="outlined"
        label="Amount to Be Paid"
        value={t - discount}
        style={{
          width: "75%",
          margin: "20px",
        }}
      />
      <FormControl
        variant="outlined"
        label="customer"
        style={
          sale_type === "retail"
            ? { display: "none" }
            : { width: "75%", margin: "20px" }
        }
      >
        <InputLabel id="customer">Customer</InputLabel>
        <Select
          inputProps={{ name: "customer" }}
          label="customer"
          id="select_customer"
          defaultValue=""
        >
          {customers.length === 0
            ? "No Customer Added"
            : customers.map((v, i) => {
                return (
                  <MenuItem
                    value={`${v.customer_surname} ${v.customer_lastname}`}
                    key={i}
                  >
                    {`${v.customer_surname} ${v.customer_lastname}`}
                  </MenuItem>
                );
              })}
        </Select>
      </FormControl>
    </div>
  );
}
