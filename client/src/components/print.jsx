import React, { Component } from "react";
import user from "../app_config";
import "../design/print_sale.css";

class Print {
  getDate() {
    let date =
      new Date(Date.now()).getDate() +
      "/" +
      (new Date(Date.now()).getMonth() + 1) +
      "/" +
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

  print_str = (data) => {
    let print_str = "";
    print_str += `
        <div>
            <div>
              <div style="font-size:13px;">FREEDOM HEALTH AND SUPPLIES LTD</div>
              <div style="font-size:10px;">Plot 7, Chegere Road Apac.</div>
              <div style="font-size:10px;">Plot P.O.Box 120 Apac</div>
              <div style="font-size:10px;">Tel: 0772 344266</div>
            </div>
            <div style="font-size:12px;">Sales Receipt</div>
            <div style="font-size:12px;">
              Date:
              ${this.getDate()}
            </div>
            <table>
              <tr>
                <th style="width:30px; font-size:10px; text-align: left;">Name</th>
                <th style="font-size:10px;">Qty</th>
                <th style="font-size:10px;">Unit</th>
                <th style="font-size:10px;">Price(Shs)</th>
              </tr>
              `;
    data.forEach((v) => {
      print_str += `
              <tr>
                <td style="width:30px; font-size:10px; white-space: pre-wrap; text-align: left;">
                  ${v.product_name}
                </td>
                <td style="font-size:10px;">${v.qty}</td>
                <td style="font-size:10px;">${v.selling_unit}</td>
                <td style="font-size:10px;">
                  ${parseInt(v.product_price) * parseInt(v.qty)}
                </td>
              </tr>
              `;
    });
    print_str += `</table>
    
              &nbsp;&nbsp;&nbsp;
              <span style="font-size:10px; margin-left:5px">Total</span>
              &nbsp;&nbsp;&nbsp;
              <span style="font-size:10px;">${this.getTotals()}</span></div>`;
    return print_str;
  };
}

export default Print;
