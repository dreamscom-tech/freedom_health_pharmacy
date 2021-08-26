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
import user from "../../app_config";
//print
import ReactToPrint from "react-to-print";
import Print from "../../components/print";

import "../../design/main.css";
import "../../design/forms.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NewPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "Please Wait...",
      messageState: "",
      _content: {},
      active_selling_unit: "",
      active_wholesale_price: "",
      empty_error: false,
      products: [],
      suppliers: [],
      formData: [],
      total: 0,
      discount: 0,
    };
    this.suppliers();
  }

  async suppliers() {
    const res = (await UsersApi.data("/user/all/suppliers")) || [];
    if (res) {
      this.setState({ ...this.state, suppliers: res === "Error" ? [] : res });
    }
  }

  handlePurchase = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, open: true, messageState: "info" });
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
          products_purchased: this.state.formData,
          date: Date.now(),
          user: user.user.username,
        },
      });
    }

    let api = new FormsApi();
    let res = await api.post("/user/sale/new_purchase", this.state._content);
    if (res.status === true) {
      this.setState({
        ...this.state,
        open: true,
        message: res.data,
        messageState: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
    this.setState({ ...this.state, open: true, messageState: "info" });
    const fd = new FormData(e.target);
    let _fcontent = {};
    fd.forEach((value, key) => {
      _fcontent[key] = value;
    });
    const product_name = this.state.formData.find(
      (e) => e.product_name === _fcontent.product_name
    );
    if (
      !_fcontent["batch_no"] ||
      !_fcontent["expiry_date"] ||
      !_fcontent["qty"] ||
      !_fcontent["cost_price"]
    ) {
      this.setState({
        ...this.state,
        empty_error: true,
        open: true,
        messageState: "error",
        message: "Some Fields are missing",
      });
      return;
    }
    if (!product_name) {
      this.setState({
        ...this.state,
        open: true,
        message: "Product Added",
        messageState: "success",
        formData: [...this.state.formData, _fcontent],
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

  handleChangeDrugName = (e, v) => {
    if (v) {
      this.setState(
        {
          ...this.state,
          active_drug: v,
        },
        () => {
          let arr = JSON.parse(this.state.active_drug.product_units);
          this.setState({
            ...this.state,
            active_selling_unit: arr[arr.length - 1].selling_unit,
            active_retail_price: arr[arr.length - 1].retail,
            active_wholesale_price: arr[arr.length - 1].wholesale,
          });
        }
      );
    }
  };

  getTotals() {
    let total = 0;
    if (this.state.formData.length !== 0) {
      this.state.formData.forEach((e) => {
        total += parseInt(e.cost_price);
      });
    }
    return total;
  }

  closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false, message: "" });
    if (this.state.empty_error) {
      this.setState({ ...this.state, empty_error: false });
    }
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
        <Nav active="purchase" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid-left">
              <div className="card">
                <div className="card-header">
                  <h3>Purchase List</h3>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    <span style={{ fontSize: "17.5px", marginRight: "10px" }}>
                      <i className="las la-redo"></i>
                    </span>
                    Cancel
                  </Button>
                </div>
                <div className="card-body tbl_ctr">
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Name</td>
                        <td>Qty</td>
                        <td>Batch No.</td>
                        <td>Expiry Date</td>
                        <td>Cost Price(Shs)</td>
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
                              <td>{v.batch_no}</td>
                              <td>{v.expiry_date}</td>
                              <td>{v.cost_price}</td>
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
                  <div className="card-header card-header-payments">
                    <h3 className="class_payment_header">New Purchase</h3>
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
                              error={this.state.empty_error}
                              name="batch_no"
                              variant="outlined"
                              label="Batch Number"
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              error={this.state.empty_error}
                              type="date"
                              name="expiry_date"
                              variant="outlined"
                              helperText="Expiry Date"
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            />
                            <FormControl
                              variant="outlined"
                              label="supplier"
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="supplier">Supplier</InputLabel>
                              <Select
                                inputProps={{ name: "supplier" }}
                                label="supplier"
                                id="select_supplier"
                                defaultValue=""
                              >
                                {this.state.suppliers.length === 0
                                  ? "No Supplier Added"
                                  : this.state.suppliers.map((v, i) => {
                                      return (
                                        <MenuItem value={v.supplier_id} key={i}>
                                          {v.supplier_surname}
                                        </MenuItem>
                                      );
                                    })}
                              </Select>
                            </FormControl>
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
                                Purchasing Unit
                              </InputLabel>
                              <Select
                                inputProps={{
                                  name: "selling_unit",
                                }}
                                label="Purchasing Unit"
                                id="select_selling_unit"
                                value={this.state.active_selling_unit}
                                onChange={(e, v) => {
                                  let arr = JSON.parse(
                                    this.state.active_drug.product_units
                                  );
                                  this.setState({
                                    ...this.state,
                                    active_retail_price: arr.find(
                                      (el) => el.selling_unit === e.target.value
                                    ).retail,
                                    active_wholesale_price: arr.find(
                                      (el) => el.selling_unit === e.target.value
                                    ).wholesale,
                                  });
                                  this.setState({
                                    ...this.state,
                                    active_selling_unit: e.target.value,
                                  });
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
                              error={this.state.empty_error}
                              type="number"
                              name="qty"
                              variant="outlined"
                              label="Quantity"
                              defaultValue={1}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              error={this.state.empty_error}
                              name="cost_price"
                              variant="outlined"
                              type="number"
                              label="Unit Cost Price(Ushs)"
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <form
                  className="card"
                  style={{ marginTop: "20px" }}
                  onSubmit={this.handlePurchase}
                >
                  <div className="card-header card-header-payments">
                    <h3 className="class_payment_header">Payment</h3>
                    <div className="">
                      <ReactToPrint
                        trigger={() => {
                          return (
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ marginRight: 10 }}
                            >
                              <span
                                style={{
                                  fontSize: "17.5px",
                                  marginRight: "10px",
                                }}
                              >
                                <i className="las la-print"></i>
                              </span>
                              Print
                            </Button>
                          );
                        }}
                        content={() => this.componentRef}
                      />
                      <Button type="submit" variant="contained" color="primary">
                        Finish Purchase
                        <span style={{ fontSize: "15px", marginLeft: "10px" }}>
                          <i className="las la-angle-double-right"></i>
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Finish t={this.getTotals()} />
                </form>
              </div>
            </div>
          </main>
        </div>
        <div style={{ display: "none" }}>
          <Print
            ref={(el) => (this.componentRef = el)}
            data={this.state.formData}
          />
        </div>
      </>
    );
  }
}

export default NewPurchase;

function Finish({ t }) {
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
        style={{
          width: "75%",
          marginLeft: "20px",
          marginBottom: "50px",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked name="print_receipt" />}
            label="Print Receipt"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}
