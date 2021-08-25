import React, { Component } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";
import { Link } from "react-router-dom";

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
      less_qty_pdts: [],
    };
    this.products();
    this.purchases();
    this.sales();
    this.expiry_products();
    this.less_qty();
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
  less_qty = async () => {
    const res = (await UsersApi.data("/user/all/less_qty")) || [];
    if (res) {
      this.setState({
        ...this.state,
        less_qty_pdts: res !== "Error" ? res : [],
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
                  <h1>{this.state.expiry_products.length}</h1>
                  <span>
                    Medicines <br />
                    <span style={{ fontSize: "13px" }}>
                      Expire in less than 90 days
                    </span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.sales_number}</h1>
                  <span>Sales</span>
                  <br />
                  <span style={{ fontSize: "13px" }}>Made This Month</span>
                </div>
                <div className="">
                  <span className="las la-users"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.purchase_number}</h1>
                  <span>Sales</span>
                  <br />
                  <span style={{ fontSize: "13px" }}>Made Today</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h1>{this.state.products.length}</h1>
                  <span>Medicines</span>
                  <br />
                  <span style={{ fontSize: "13px" }}>Registered</span>
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
                    <h3>Batches - Expiring In 90 Days</h3>
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
                      <Link to="/all-products">
                        <MenuItem onClick={this.handleCloseActionsDrugs}>
                          See All
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
                    <h3>Quantity Less</h3>
                    <div className="">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          window.location.reload();
                        }}
                        style={{ marginRight: "15px" }}
                      >
                        <span
                          style={{ fontSize: "17.5px", marginLeft: "10px" }}
                        >
                          <span className="las la-redo"></span>
                        </span>
                        Refresh
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        aria-controls="reception-actions"
                        aria-haspopup="true"
                        onClick={this.handleOpenActions}
                      >
                        Other Menu
                        <span
                          style={{ fontSize: "17.5px", marginLeft: "10px" }}
                        >
                          <span className="las la-angle-down"></span>
                        </span>
                      </Button>
                      <Menu
                        id="reception-actions"
                        anchorEl={this.state.AnchorEl}
                        keepMounted
                        open={Boolean(this.state.AnchorEl)}
                        onClose={this.handleCloseActions}
                        disableScrollLock={true}
                      >
                        <Link to="/new-user">
                          <MenuItem onClick={this.handleCloseActions}>
                            New User
                          </MenuItem>
                        </Link>
                        <Link to="/new-supplier">
                          <MenuItem onClick={this.handleCloseActions}>
                            New Supplier
                          </MenuItem>
                        </Link>
                        <Link to="/new-customer">
                          <MenuItem onClick={this.handleCloseActions}>
                            New Customer
                          </MenuItem>
                        </Link>
                      </Menu>
                    </div>
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>No.</td>
                          <td>Name</td>
                          <td>Quantity</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.less_qty_pdts.length === 0 ? (
                          <tr>
                            <td>No Medicines to display</td>
                          </tr>
                        ) : (
                          this.state.less_qty_pdts.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td className="name_cell">
                                  {`
                                  ${v.product_generic_name}
                                  ${v.product_description_name}
                                  `}
                                </td>
                                <td>{v.product_qty}</td>
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
      </>
    );
  }
}

export default Dashboard;
