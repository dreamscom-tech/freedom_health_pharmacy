import React, { Component } from "react";
import "../design/print_sale.css";

class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.data,
    };
    console.log(this.state);
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
              <span> RXPlus Pharmacy</span>
              <span>Plot 11 Main Street, Lira City</span>
              <span>Tel: 0781240411</span>
              <span>No. 127</span>
            </div>
            <div className="print-title">Sales Receipt</div>
            <div className="date">Date: July 31, 2021</div>
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
            <div className="attendant">Served By: Xamuel</div>
          </div>
        </div>
      </>
    );
  }
}

export default Print;
