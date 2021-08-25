import React, { Component } from "react";
import user from "../app_config";
import "../design/print_sale.css";

class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.data,
    };
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

  getTotals() {
    let total = 0;
    if (this.state.formData.length !== 0) {
      this.state.formData.forEach((e) => {
        total += parseInt(e.product_price) * parseInt(e.qty);
      });
    }
    return total;
  }
  render() {
    return (
      <>
        <div className="print-ctr">
          <div className="print">
            <div className="print-pharmacy">
              <span> Freedom Pharmacy</span>
              <span>Apac Municipality</span>
              <span>Tel: 0772 344266</span>
            </div>
            <div className="print-title">Sales Receipt</div>
            <div className="date">
              Date:
              {this.getDate()}
            </div>
            <div className="content">
              <table>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Qty</td>
                    <td>Unit Price(Shs)</td>
                    <td>Total(Shs)</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.formData.length === 0 ? (
                    <tr>
                      <td>No Content To Print</td>
                    </tr>
                  ) : (
                    this.state.formData.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>{v.product_name}</td>
                          <td>{v.qty}</td>
                          <td>{v.product_price}</td>
                          <td>{parseInt(v.product_price) * parseInt(v.qty)}</td>
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
            <div className="attendant">Served By: {user.user.username}</div>
          </div>
        </div>
      </>
    );
  }
}

export default Print;
