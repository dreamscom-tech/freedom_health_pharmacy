import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";

import ReactToPrint from "react-to-print";
import Print from "../../components/print";

class AllSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sales: [],
    };
    this.sales();
  }

  async sales() {
    const res = (await UsersApi.data("/user/all/sales")) || [];
    if (res !== "Error") {
      let sale = [];
      res.forEach((e) => {
        if (
          new Date(parseInt(e.sales_date)).getMonth() ===
          new Date(Date.now()).getMonth()
        ) {
          sale.push(e);
        }
      });
      this.setState({ ...this.state, sales: sale, print: true });
    }
  }

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };

  getNameSpaces(n, i) {
    let name = n.split(" ")[0];
    let name_formatted;
    if (name.length === i) {
      name_formatted = name + " ";
    }
    if (name.length > i) {
      name_formatted = name.substring(0, i) + " ";
    }
    if (name.length < i) {
      name_formatted = name;
      let spaces = i - name.length;
      for (let i = 0; i < spaces; i++) {
        name_formatted = name_formatted + " ";
      }
    }
    return name_formatted;
  }

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="finance" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Monthly Sales Made</h3>

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
                              <i className="las la-file-pdf"></i>
                            </span>
                            Save PDF
                          </Button>
                        );
                      }}
                      content={() => this.componentRef}
                    />
                  </div>
                  <div className="card-body">
                    <table style={{ width: "85%", margin: "auto" }}>
                      <thead>
                        <tr>
                          <td>Products</td>
                          <td>Total</td>
                          <td>Discount</td>
                          <td>Paid</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.sales.length === 0 ? (
                          <tr>
                            <td>No Sale Made</td>
                          </tr>
                        ) : (
                          this.state.sales.map((v, i) => {
                            let products = "";
                            let sold = JSON.parse(v.products_sold);
                            sold.forEach((p) => {
                              if (sold.length > 1) {
                                if (sold.indexOf(p) === sold.length - 1) {
                                  products =
                                    products +
                                    `${this.getNameSpaces(p.product_name, 10)}`;
                                } else {
                                  products =
                                    products +
                                    `${this.getNameSpaces(
                                      p.product_name,
                                      10
                                    )}` +
                                    ",";
                                }
                              } else {
                                products =
                                  products +
                                  `${this.getNameSpaces(p.product_name, 10)}`;
                              }
                            });
                            return (
                              <tr key={i}>
                                <td>{products}</td>
                                <td>{v.sales_amount}</td>
                                <td>{v.sales_discount}</td>
                                <td>{v.amount_paid}</td>
                                <td>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                      this.setState({
                                        ...this.state,
                                        open: true,
                                        dialog_data: v,
                                      });
                                    }}
                                  >
                                    Details
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div style={{ display: "none" }}>
          {this.state.print ? (
            <Print
              ref={(el) => (this.componentRef = el)}
              data={this.state.sales}
              type="sales"
            />
          ) : (
            <></>
          )}
        </div>
        {this.state.dialog_data ? (
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Sale Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <table width="100%">
                  <thead>
                    <tr>
                      <td>Product</td>
                      <td>Qty</td>
                      <td>Selling Unit</td>
                      <td>Amount</td>
                      <td>Sale Type</td>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(this.state.dialog_data.products_sold).map(
                      (v, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="name_cell">{v.product_name}</td>
                              <td>{v.qty}</td>
                              <td>{v.selling_unit}</td>
                              <td>{v.product_price}</td>
                              <td>{v.sale_type}</td>
                            </tr>
                          </>
                        );
                      }
                    )}
                  </tbody>
                </table>
                <hr />
                <div className="">
                  <table>
                    <tr>
                      <td>
                        {`Total Amount: UGX ${this.state.dialog_data.sales_amount}`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Discount: UGX {this.state.dialog_data.sales_discount}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Amount Paid: UGX {this.state.dialog_data.amount_paid}
                      </td>
                    </tr>
                    {`Made By: ${this.state.dialog_data.sale_made_by}`}
                  </table>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default AllSales;
