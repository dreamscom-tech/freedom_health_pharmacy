import React, { Component } from "react";
import Helper from "./format";
import "../design/print_sale.css";

class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTotals() {
    let total = 0;
    if (this.props.data.length !== 0) {
      this.props.data.forEach((s) => {
        total += parseInt(s.amount_paid);
      });
    }
    return Helper.format(total);
  }
  getPurchaseTotals() {
    let total = 0;
    if (this.props.data.length !== 0) {
      this.props.data.forEach((s) => {
        total += parseInt(s.purchase_amount);
      });
    }
    return Helper.format(total);
  }
  getMonth() {
    let month = new Date(Date.now()).getMonth();
    if (month === 0) {
      return "January";
    } else if (month === 1) {
      return "February";
    } else if (month === 2) {
      return "March";
    } else if (month === 3) {
      return "April";
    } else if (month === 4) {
      return "May";
    } else if (month === 5) {
      return "June";
    } else if (month === 6) {
      return "July";
    } else if (month === 7) {
      return "August";
    } else if (month === 8) {
      return "September";
    } else if (month === 9) {
      return "October";
    } else if (month === 10) {
      return "November";
    } else if (month === 11) {
      return "December";
    }
  }
  getDate() {
    let date =
      new Date(Date.now()).getDate() +
      " / " +
      (new Date(Date.now()).getMonth() + 1) +
      " / " +
      new Date(Date.now()).getFullYear();
    return date;
  }
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
    if (this.props.type === "sales") {
      return (
        <>
          <div className="print-ctr">
            <div className="print">
              <div className="print-pharmacy">
                <span> Freedom Health Pharmacy</span>
                <span style={{ fontSize: "20px" }}>
                  Plot 7, Chegere Road Apac.
                </span>
                <span style={{ fontSize: "20px" }}>Tel: 0393 193 423</span>
              </div>
              <div className="print-title">Sales File</div>
              <div className="date">Date: {this.getDate()}</div>
              <div className="date">Month: {this.getMonth()}</div>
              <div className="content">
                <table width="90%" style={{ margin: "auto" }}>
                  <thead>
                    <tr>
                      <td>Products</td>
                      <td>Total Amount</td>
                      <td>Amount Paid</td>
                      <td>Made By</td>
                      <td>Sale Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.data.length === 0 ? (
                      <tr>
                        <td>No Content To Print</td>
                      </tr>
                    ) : (
                      this.props.data.map((v, i) => {
                        let products = "";
                        let sold = JSON.parse(v.products_sold);
                        sold.forEach((p) => {
                          if (sold.length > 1) {
                            products =
                              products +
                              `${this.getNameSpaces(p.product_name, 10)}` +
                              ",";
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
                            <td>{v.amount_paid}</td>
                            <td>{v.sale_made_by}</td>
                            <td>
                              {new Date(parseInt(v.sales_date)).getDate() +
                                " / " +
                                (new Date(parseInt(v.sales_date)).getMonth() +
                                  1) +
                                " / " +
                                new Date(parseInt(v.sales_date)).getFullYear()}
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
                      <td>Total Sales</td>
                      <td>{`${this.props.data.length}`}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Total Income</td>
                      <td>{`UGX ${this.getTotals()}`}</td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.props.type === "purchases") {
      return (
        <>
          <div className="print-ctr">
            <div className="print">
              <div className="print-pharmacy">
                <span> Freedom Health Pharmacy</span>
                <span style={{ fontSize: "20px" }}>
                  Plot 7, Chegere Road Apac.
                </span>
                <span style={{ fontSize: "20px" }}>Tel: 0393 193 423</span>
              </div>
              <div className="print-title">Purchases File</div>
              <div className="date">Date: {this.getDate()}</div>
              <div className="date">Month: {this.getMonth()}</div>
              <div className="content">
                <table width="90%" style={{ margin: "auto" }}>
                  <thead>
                    <tr>
                      <td>Products</td>
                      <td>Total Amount</td>
                      <td>Amount Paid</td>
                      <td>Made By</td>
                      <td>Purchase Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.data.length === 0 ? (
                      <tr>
                        <td>No Content To Print</td>
                      </tr>
                    ) : (
                      this.props.data.map((v, i) => {
                        let products = "";
                        let sold = JSON.parse(v.products_purchased);
                        sold.forEach((p) => {
                          if (sold.length > 1) {
                            products =
                              products +
                              `${this.getNameSpaces(p.product_name, 10)}` +
                              ",";
                          } else {
                            products =
                              products +
                              `${this.getNameSpaces(p.product_name, 10)}`;
                          }
                        });
                        return (
                          <tr key={i}>
                            <td>{products}</td>
                            <td>{v.purchase_t_amount}</td>
                            <td>{v.purchase_amount}</td>
                            <td>{v.purchase_made_by}</td>
                            <td>
                              {new Date(parseInt(v.purchase_date)).getDate() +
                                " / " +
                                (new Date(
                                  parseInt(v.purchase_date)
                                ).getMonth() +
                                  1) +
                                " / " +
                                new Date(
                                  parseInt(v.purchase_date)
                                ).getFullYear()}
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
                      <td>Total Purchases</td>
                      <td>{`${this.props.data.length}`}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Total Amount Spent</td>
                      <td>{`UGX ${this.getPurchaseTotals()}`}</td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default Print;
