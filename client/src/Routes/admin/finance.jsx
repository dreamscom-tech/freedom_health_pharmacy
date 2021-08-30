import React, { Component } from "react";
import {
  Button,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import MuiAlert from "@material-ui/lab/Alert";
import UsersApi from "../../api/users";
import Helper from "../../components/format";
import { Link } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElDrugs: null,
      open: false,
      open_purchase: false,
      open_sale: false,
      message: "Please Wait...",
      messageState: "",
      income: 0,
      today_income: 0,
      expenses: 0,
      today_expense: 0,
      sales: [],
      purchases: [],
    };
    this.income();
    this.expenses();
  }

  handlePurchaseClose = () => {
    this.setState({ ...this.state, open_purchase: false });
  };
  handleSaleClose = () => {
    this.setState({ ...this.state, open_sale: false });
  };

  async income() {
    const res = (await UsersApi.data("/user/all/sales")) || [];
    let total = 0;
    let today_income = 0;
    let today_sales = [];
    res === "Error"
      ? this.setState({ ...this.state, income: 0, sales: [] })
      : res.forEach((e) => {
          if (
            new Date(parseInt(e.sales_date)).getDate() ===
            new Date(Date.now()).getDate()
          ) {
            today_income += e.amount_paid;
            today_sales.push(e);
          }
          if (
            new Date(parseInt(e.sales_date)).getMonth() ===
            new Date(Date.now()).getMonth()
          ) {
            total += e.amount_paid;
          }
        });
    this.setState({
      ...this.state,
      today_income: today_income,
      income: total,
      sales: today_sales,
    });
  }

  async expenses() {
    const res = (await UsersApi.data("/user/all/purchases")) || [];
    let total = 0;
    let today_expense = 0;
    let today_purchases = [];
    res === "Error"
      ? this.setState({ ...this.state, expenses: 0, purchases: [] })
      : res.forEach((e) => {
          if (
            new Date(parseInt(e.purchase_date)).getDate() ===
            new Date(Date.now()).getDate()
          ) {
            today_expense += e.purchase_amount;
            today_purchases.push(e);
          }
          if (
            new Date(parseInt(e.purchase_date)).getMonth() ===
            new Date(Date.now()).getMonth
          ) {
            total += e.purchase_amount;
          }
        });
    this.setState({
      ...this.state,
      today_expense: today_expense,
      expenses: total,
      purchases: today_purchases,
    });
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
        <Nav active="finance" />
        <div className="main-content">
          <Header />
          <main>
            <div className="cards">
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.today_income)}</h4>
                  <span>
                    Sales <br />
                    <span style={{ fontSize: "13px" }}>Today</span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.today_expense)}</h4>
                  <span>
                    Purchases <br />
                    <span style={{ fontSize: "13px" }}>Today</span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-users"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.expenses)}</h4>
                  <span>
                    Total Purchase <br />
                    <span style={{ fontSize: "13px" }}>This Month</span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.income)}</h4>
                  <span>
                    Total Income <br />
                    <span style={{ fontSize: "13px" }}>This Month</span>
                  </span>
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
                    <h3>Sales Today</h3>
                    <div className="">
                      <Button
                        variant="contained"
                        color="primary"
                        aria-controls="drug-actions"
                        aria-haspopup="true"
                        onClick={this.handleOpenActionsDrugs}
                      >
                        Menu
                        <span
                          style={{ fontSize: "17.5px", marginLeft: "10px" }}
                        >
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
                        <Link to="/all-sales">
                          <MenuItem onClick={this.handleCloseActionsDrugs}>
                            See Monthly
                          </MenuItem>
                        </Link>
                        <Link>
                          <MenuItem onClick={this.handleCloseActionsDrugs}>
                            Download
                          </MenuItem>
                        </Link>
                      </Menu>
                    </div>
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
                        {this.state.sales.length === 0 ? (
                          <tr>
                            <td>No Sale Made Today</td>
                          </tr>
                        ) : (
                          this.state.sales.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.sales_amount}</td>
                                <td>{v.sales_discount}</td>
                                <td>{v.amount_paid}</td>
                                <td>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
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
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Purchases Today</h3>
                    <div className="">
                      <Button
                        variant="contained"
                        color="primary"
                        aria-controls="reception-actions"
                        aria-haspopup="true"
                        onClick={this.handleOpenActions}
                      >
                        Menu
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
                        <Link to="/all-purchases">
                          <MenuItem onClick={this.handleCloseActions}>
                            See Monthly
                          </MenuItem>
                        </Link>
                        <Link>
                          <MenuItem onClick={this.handleCloseActions}>
                            Download
                          </MenuItem>
                        </Link>
                      </Menu>
                    </div>
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
                        {this.state.purchases.length === 0 ? (
                          <tr>
                            <td>No Purchase Made Today</td>
                          </tr>
                        ) : (
                          this.state.purchases.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.purchase_t_amount}</td>
                                <td>{v.purchase_discount}</td>
                                <td>{v.purchase_amount}</td>
                                <td>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        ...this.state,
                                        open_purchase: true,
                                        dialog_purchase_data: v,
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
        {/* Sale Dialog */}
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
                          <tr key={i}>
                            <td className="name_cell">{v.product_name}</td>
                            <td>{v.qty}</td>
                            <td>{v.selling_unit}</td>
                            <td>{v.product_price}</td>
                            <td>{v.sale_type}</td>
                          </tr>
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
                    {`Made By: ${this.state.dialog_data.sale_made_by}`}
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
        {/* Purchase Dialog */}
        {this.state.dialog_purchase_data ? (
          <Dialog
            open={this.state.open_purchase}
            onClose={this.handlePurchaseClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Purchase Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <table width="100%">
                  <thead>
                    <tr>
                      <td>Product</td>
                      <td>Qty</td>
                      <td>Selling Unit</td>
                      <td>Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(
                      this.state.dialog_purchase_data.products_purchased
                    ).map((v, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td className="name_cell">{v.product_name}</td>
                            <td>{v.qty}</td>
                            <td>{v.selling_unit}</td>
                            <td>{v.cost_price}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                <hr />
                <div className="">
                  <table>
                    <tr>
                      <td>
                        {`Total Amount: UGX ${this.state.dialog_purchase_data.purchase_t_amount}`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {`Discount: UGX ${this.state.dialog_purchase_data.purchase_discount}`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {`Amount Paid: UGX ${this.state.dialog_purchase_data.purchase_amount}`}
                      </td>
                    </tr>
                    <tr>
                      {`Made By: ${this.state.dialog_purchase_data.purchase_made_by}`}
                    </tr>
                  </table>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handlePurchaseClose} color="primary">
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

export default Finance;
