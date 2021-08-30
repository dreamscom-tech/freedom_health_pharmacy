import React, { Component } from "react";
import user from "../app_config";
import "../design/print_sale.css";
import "../assets/fhp.jpg";

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
        <div className="print-ctr" style={{ margin: "0", padding: "0" }}>
          <div className="print">
            <div className="print-pharmacy">
              <span>FREEDOM HEALTH AND SUPPLIES LTD</span>
              <span>Plot 7, Chegere Road Apac.</span>
              <span>Plot P.O.Box 120 Apac</span>
              <span>Tel: 0772 344266</span>
            </div>
            <div className="print-title">Sales Receipt</div>
            <div className="date">
              Date:
              {this.getDate()}
            </div>
            <div className="content">
              <div className="grid grid-hdr">
                <div className="grid-row">Name</div>
                <div className="grid-row">Qty</div>
                <div className="grid-row">Price(Shs)</div>
              </div>
              {this.state.formData.length === 0 ? (
                <div className="grid">
                  <div className="grid-row">No Content To Print</div>
                </div>
              ) : (
                this.state.formData.map((v, i) => {
                  return (
                    <div className="grid" key={i}>
                      <div className="grid-row">{v.product_name}</div>
                      <div className="grid-row">{v.qty}</div>
                      <div className="grid-row">
                        {parseInt(v.product_price) * parseInt(v.qty)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="attendant">Served By: {user.user.username}</div>
          </div>
        </div>
      </>
    );
  }
}

export default Print;
