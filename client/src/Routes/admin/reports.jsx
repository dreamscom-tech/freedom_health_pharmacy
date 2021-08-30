import React, { Component } from "react";
import { Button } from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";
import Helper from "../../components/format";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElDrugs: null,
      daily: {
        date: "...",
        daily_purchases: 0,
        daily_expenses: 0,
        daily_products: 0,
        daily_income: 0,
        daily_sales: 0,
      },
      monthly: {
        month: "...",
        monthly_products: 0,
        monthly_purchases: 0,
        monthly_expenses: 0,
        monthly_income: 0,
        monthly_sales: 0,
      },
      annually: {
        year: "...",
        annual_products: 0,
        annual_expenses: 0,
        annual_purchases: 0,
        annual_income: 0,
        annual_sales: 0,
      },
    };
    this.products();
    this.purchases();
    this.sales();
  }

  async products() {
    const res = (await UsersApi.data("/user/all/products")) || [];
    let products_daily = 0;
    let products_monthly = 0;
    let products_annual = 0;
    res === "Error"
      ? this.setState({
          ...this.state,
          daily: { ...this.state.daily, daily_products: 0 },
          monthly: { ...this.state.monthly, monthly_products: 0 },
          annually: { ...this.state.annually, annual_products: 0 },
        })
      : res.forEach((e) => {
          if (
            new Date(parseInt(e.product_date)).getDate() ===
            new Date(Date.now()).getDate()
          ) {
            products_daily++;
          }
          if (
            new Date(parseInt(e.product_date)).getMonth() ===
            new Date(Date.now()).getMonth()
          ) {
            products_monthly++;
          }
          if (
            new Date(parseInt(e.product_date)).getFullYear() ===
            new Date(Date.now()).getFullYear()
          ) {
            products_annual++;
          }
        });
    this.setState({
      ...this.state,
      daily: {
        ...this.state.daily,
        daily_products: products_daily,
        date:
          new Date(Date.now()).getDate() +
          "/" +
          (new Date(Date.now()).getMonth() + 1) +
          "/" +
          new Date(Date.now()).getFullYear(),
      },
      monthly: { ...this.state.monthly, monthly_products: products_monthly },
      annually: {
        ...this.state.annually,
        year: new Date(Date.now()).getFullYear(),
        annual_products: products_annual,
      },
    });
    if (new Date(Date.now()).getMonth() === 0) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "January" },
      });
    } else if (new Date(Date.now()).getMonth() === 1) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "February" },
      });
    } else if (new Date(Date.now()).getMonth() === 2) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "March" },
      });
    } else if (new Date(Date.now()).getMonth() === 3) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "April" },
      });
    } else if (new Date(Date.now()).getMonth() === 4) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "May" },
      });
    } else if (new Date(Date.now()).getMonth() === 5) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "June" },
      });
    } else if (new Date(Date.now()).getMonth() === 6) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "July" },
      });
    } else if (new Date(Date.now()).getMonth() === 7) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "August" },
      });
    } else if (new Date(Date.now()).getMonth() === 8) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "September" },
      });
    } else if (new Date(Date.now()).getMonth() === 9) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "October" },
      });
    } else if (new Date(Date.now()).getMonth() === 10) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "November" },
      });
    } else if (new Date(Date.now()).getMonth() === 11) {
      this.setState({
        ...this.state,
        monthly: { ...this.state.monthly, month: "December" },
      });
    }
  }

  async purchases() {
    const res = (await UsersApi.data("/user/all/purchases")) || [];
    let purchase_daily = 0;
    let expense_daily = 0;
    let purchase_monthly = 0;
    let expense_monthly = 0;
    let purchase_annual = 0;
    let expense_annual = 0;
    res === "Error"
      ? this.setState({
          ...this.state,
          daily: { ...this.state.daily, daily_purchases: 0, daily_expenses: 0 },
          monthly: {
            ...this.state.monthly,
            monthly_expenses: 0,
            monthly_purchases: 0,
          },
          annually: {
            ...this.state.annually,
            annual_expenses: 0,
            annual_purchases: 0,
          },
        })
      : res.forEach((e) => {
          if (
            new Date(parseInt(e.purchase_date)).getDate() ===
            new Date(Date.now()).getDate()
          ) {
            purchase_daily++;
            expense_daily += e.purchase_amount;
          }
          if (
            new Date(Date.now()).getMonth() ===
            new Date(parseInt(e.purchase_date)).getMonth()
          ) {
            purchase_monthly++;
            expense_monthly += e.purchase_amount;
          }
          if (
            new Date(Date.now()).getFullYear() ===
            new Date(parseInt(e.purchase_date)).getFullYear()
          ) {
            purchase_annual++;
            expense_annual += e.purchase_amount;
          }
        });
    this.setState({
      ...this.state,
      daily: {
        ...this.state.daily,
        daily_purchases: purchase_daily,
        daily_expenses: expense_daily,
      },
      monthly: {
        ...this.state.monthly,
        monthly_expenses: expense_monthly,
        monthly_purchases: purchase_monthly,
      },
      annually: {
        ...this.state.annually,
        annual_expenses: expense_annual,
        annual_purchases: purchase_annual,
      },
    });
  }

  async sales() {
    const res = (await UsersApi.data("/user/all/sales")) || [];
    let income_daily = 0;
    let sales_daily = 0;
    let income_monthly = 0;
    let sales_monthly = 0;
    let income_annual = 0;
    let sales_annual = 0;
    res === "Error"
      ? this.setState({
          ...this.state,
          daily: { ...this.state.daily, daily_income: 0, daily_sales: 0 },
          monthly: {
            ...this.state.monthly,
            monthly_income: 0,
            monthly_sales: 0,
          },
          annually: {
            ...this.state.annually,
            annual_income: 0,
            annual_sales: 0,
          },
        })
      : res.forEach((e) => {
          if (
            new Date(parseInt(e.sales_date)).getDate() ===
            new Date(Date.now()).getDate()
          ) {
            income_daily += e.amount_paid;
            sales_daily++;
          }

          if (
            new Date(Date.now()).getMonth() ===
            new Date(parseInt(e.sales_date)).getMonth()
          ) {
            income_monthly += e.amount_paid;
            sales_monthly++;
          }
          if (
            new Date(Date.now()).getFullYear() ===
            new Date(parseInt(e.sales_date)).getFullYear()
          ) {
            income_annual += e.amount_paid;
            sales_annual++;
          }
        });
    this.setState({
      ...this.state,
      daily: {
        ...this.state.daily,
        daily_sales: sales_daily,
        daily_income: income_daily,
      },
      monthly: {
        ...this.state.monthly,
        monthly_sales: sales_monthly,
        monthly_income: income_monthly,
      },
      annually: {
        ...this.state.annually,
        annual_sales: sales_annual,
        annual_income: income_annual,
      },
    });
  }

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="reports" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Today</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-haspopup="true"
                    >
                      print
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-print"></span>
                      </span>
                    </Button>
                  </div>
                  <div className="card-body">
                    <div className="">
                      <table width="100%">
                        <tr>
                          <td>
                            <span
                              style={{ fontWeight: "bolder", color: "red" }}
                            >
                              Date:
                            </span>
                            {`  ${this.state.daily.date}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Purchases:
                            </span>
                            {`  ${this.state.daily.daily_purchases}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Sales:
                            </span>
                            {` ${this.state.daily.daily_sales}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Expenses:
                            </span>
                            {`   UGX ${Helper.format(
                              this.state.daily.daily_expenses
                            )}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Income:
                            </span>
                            {`   UGX ${Helper.format(
                              this.state.daily.daily_income
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Products Registered:
                            </span>
                            {`  ${this.state.daily.daily_products}`}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>This Month</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-controls="reception-actions"
                      aria-haspopup="true"
                    >
                      print
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-print"></span>
                      </span>
                    </Button>
                  </div>
                  <div className="card-body">
                    <div className="">
                      <table width="100%">
                        <tr>
                          <td>
                            <span
                              style={{ fontWeight: "bolder", color: "red" }}
                            >
                              Month:
                            </span>
                            {`  ${this.state.monthly.month}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Purchases:
                            </span>
                            {` ${this.state.monthly.monthly_purchases}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Sales:
                            </span>
                            {` ${this.state.monthly.monthly_sales}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Expenses:
                            </span>
                            {`  UGX ${Helper.format(
                              this.state.monthly.monthly_expenses
                            )}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Income:
                            </span>
                            {`  UGX ${Helper.format(
                              this.state.monthly.monthly_income
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Products Registered:
                            </span>
                            {`  ${this.state.monthly.monthly_products}`}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="recent-grid">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>This Year</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-haspopup="true"
                    >
                      print
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-print"></span>
                      </span>
                    </Button>
                  </div>
                  <div className="card-body">
                    <div className="">
                      <table width="100%">
                        <tr>
                          <td>
                            <span
                              style={{ fontWeight: "bolder", color: "red" }}
                            >
                              Year:
                            </span>
                            {`  ${this.state.annually.year}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Purchases:
                            </span>
                            {`  ${this.state.annually.annual_purchases}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Sales:
                            </span>
                            {` ${this.state.annually.annual_sales}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Expenses:
                            </span>
                            {`  UGX ${Helper.format(
                              this.state.annually.annual_expenses
                            )}`}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Total Income:
                            </span>
                            {` UGX ${Helper.format(
                              this.state.annually.annual_income
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bolder" }}>
                              Products Registered:
                            </span>
                            {`  ${this.state.annually.annual_products}`}
                          </td>
                        </tr>
                      </table>
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

export default Reports;
