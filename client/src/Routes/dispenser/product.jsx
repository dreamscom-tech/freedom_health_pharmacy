import React, { Component } from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import MuiAlert from "@material-ui/lab/Alert";
import UsersApi from "../../api/users";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "Please Wait...",
      messageState: "",
      product: {},
    };
    this.product();
  }

  async product() {
    let id = parseInt(
      new URLSearchParams(window.location.search).get("product-id")
    );
    const [res] = await UsersApi.data(`/user/all/product/${id}`);
    if (res) {
      this.setState({ ...this.state, product: res === "Error" ? {} : res });
    }
  }

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
        <Nav active="dashboard" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <div className="card">
                  <div
                    className=""
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: "1rem",
                    }}
                  >
                    <div className="form-header-ctr">
                      <div className="">
                        <h3>Product Details</h3>
                      </div>
                      <div className="">
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginInline: 10 }}
                        >
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h3>
                          Product No: {this.state.product.product_track_number}
                        </h3>
                        <div className="inputs_ctr">
                          <table width="100%">
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Product Name :
                                </span>
                                {this.state.product.product_name}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Quantity in Stock :
                                </span>
                                {this.state.product.quantity}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Unit Price :
                                </span>
                                {"UGX"}
                                {""}
                                {this.state.product.unit_price}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Cost Price :
                                </span>
                                {"UGX"} {""}
                                {this.state.product.cost_price}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Total Sales:
                                </span>
                                0
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Income:
                                </span>
                                UGX 0
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Total Purchases:
                                </span>
                                0
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Expenses:
                                </span>
                                UGX 0
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Date Added :
                                </span>
                                {new Date(
                                  this.state.product.date_added
                                ).getDate() +
                                  "-" +
                                  (new Date(
                                    this.state.product.date_added
                                  ).getMonth() +
                                    1) +
                                  "-" +
                                  new Date(
                                    this.state.product.date_added
                                  ).getFullYear()}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Time :
                                </span>
                                {new Date(
                                  this.state.product.date_added
                                ).getHours() +
                                  ":" +
                                  new Date(
                                    this.state.product.date_added
                                  ).getMinutes() +
                                  (new Date(
                                    this.state.product.date_added
                                  ).getHours() < 12
                                    ? "AM"
                                    : "PM")}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Expiry Date :
                                </span>
                                {this.state.product.expiry_date}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Description :
                                </span>
                                {this.state.product.product_description}
                              </td>
                            </tr>
                          </table>
                        </div>
                        <h5>Supplier</h5>
                        <div className="inputs_ctr">
                          <table width="100%">
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Surname :
                                </span>
                                {this.state.product.supplier_surname}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Lastname :
                                </span>
                                {this.state.product.supplier_lastname}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Date Added :
                                </span>
                                {new Date(
                                  this.state.product.date_registered
                                ).getDate() +
                                  "-" +
                                  (new Date(
                                    this.state.product.date_registered
                                  ).getMonth() +
                                    1) +
                                  "-" +
                                  new Date(
                                    this.state.product.date_registered
                                  ).getFullYear()}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Time :
                                </span>
                                {new Date(
                                  this.state.product.date_registered
                                ).getHours() +
                                  ":" +
                                  new Date(
                                    this.state.product.date_registered
                                  ).getMinutes() +
                                  (new Date(
                                    this.state.product.date_registered
                                  ).getHours() < 12
                                    ? "AM"
                                    : "PM")}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Contact :
                                </span>
                                {this.state.product.supplier_contact}
                              </td>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Location :
                                </span>
                                {this.state.product.supplier_location}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style={{ fontWeight: "bolder" }}>
                                  Address :
                                </span>
                                {this.state.product.supplier_address}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
}

export default Product;
