import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";
import user from "../../app_config";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElDrugs: null,
      products: [],
      purchase_number: "...",
      sales_number: "...",
      expiry_products: [],
      my_sales: [],
      open_sale: false,
    };
    this.products();
    this.purchases();
    this.sales();
    this.expiry_products();
    this.my_sales();
  }

  async my_sales() {
    const res =
      (await UsersApi.data(`/user/all/my_sales/${user.user.username}`)) || [];
    if (res) {
      this.setState({ ...this.state, my_sales: res !== "Error" ? res : [] });
    }
  }

  expiry_products = async () => {
    const res = (await UsersApi.data("/user/all/batch/expiry")) || [];
    if (res) {
      this.setState({
        ...this.state,
        expiry_products: res !== "Error" ? res : [],
      });
    }
  };

  async products() {
    const res = (await UsersApi.data("/user/all/products")) || [];
    if (res) {
      this.setState({ ...this.state, products: res });
    }
  }

  async purchases() {
    const res = (await UsersApi.data("/user/all/purchases")) || [];
    if (res) {
      this.setState({ ...this.state, purchase_number: res.length });
    }
  }

  async sales() {
    const res = (await UsersApi.data("/user/all/sales")) || [];
    if (res) {
      this.setState({ ...this.state, sales_number: res.length });
    }
  }

  handleSaleClose = () => {
    this.setState({ ...this.state, open_sale: false });
  };

  handleOpenActions = (e) => {
    this.setState({ ...this.state, AnchorEl: e.currentTarget });
  };
  handleOpenActionsDrugs = (e) => {
    this.setState({ ...this.state, AnchorElDrugs: e.currentTarget });
  };
  handleCloseActions = () => {
    this.setState({ ...this.state, AnchorEl: null });
  };
  handleCloseActionsDrugs = () => {
    this.setState({ ...this.state, AnchorElDrugs: null });
  };

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="dashboard" />
        <div className="main-content">
          <Header />
          <main>
            <div className="cards">
              <div className="card-single">
                <div className="">
                  <h1>{this.state.my_sales.length}</h1>
                  <span>My Sales</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.sales_number}</h1>
                  <span>Sales</span>
                </div>
                <div className="">
                  <span className="las la-users"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.purchase_number}</h1>
                  <span>Purchases</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.products.length}</h1>
                  <span>Total Products</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
            </div>
            <div className="recent-grid">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Expiring in 90 days</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-controls="drug-actions"
                      aria-haspopup="true"
                      onClick={this.handleOpenActionsDrugs}
                    >
                      Menu
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-angle-down"></span>
                      </span>
                    </Button>
                    <Menu
                      id="drug-actions"
                      anchorEl={this.state.AnchorElDrugs}
                      keepMounted
                      open={Boolean(this.state.AnchorElDrugs)}
                      onClose={this.handleCloseActionsDrugs}
                      disableScrollLock={true}
                    >
                      <Link to="/new-product">
                        <MenuItem onClick={this.handleCloseActionsDrugs}>
                          New Product
                        </MenuItem>
                      </Link>
                    </Menu>
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>Batch No.</td>
                          <td>Quantity In Batch</td>
                          <td>Expires On</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.expiry_products.length === 0 ? (
                          <tr>
                            <td>No Medicine Expires In 90 days</td>
                          </tr>
                        ) : (
                          this.state.expiry_products.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td className="name_cell">
                                  {v.product_generic_name}
                                </td>
                                <td>{v.batch_no}</td>
                                <td>{v.batch_qty}</td>
                                <td>{v.batch_expiry_date}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>My Sales</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-controls="reception-actions"
                      aria-haspopup="true"
                      onClick={this.handleOpenActions}
                    >
                      See All
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-angle-down"></span>
                      </span>
                    </Button>
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Total</td>
                          <td>Discont</td>
                          <td>Paid</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.my_sales.length === 0 ? (
                          <tr>
                            <td>No sale made</td>
                          </tr>
                        ) : (
                          this.state.my_sales.map((v, i) => {
                            return (
                              <tr key={i}>
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
                                        open_sale: true,
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
        {this.state.dialog_data ? (
          <Dialog
            open={this.state.open_sale}
            onClose={this.handleSaleClose}
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
                              <td>{v.product_name}</td>
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
                        {`Discount: UGX  ${this.state.dialog_data.sales_discount}`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {`Amount Paid: UGX ${this.state.dialog_data.amount_paid}`}
                      </td>
                    </tr>
                  </table>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSaleClose} color="primary">
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

export default Dashboard;
