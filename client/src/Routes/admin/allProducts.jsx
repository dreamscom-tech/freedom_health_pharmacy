import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";

class AllProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
    this.products();
  }

  async products() {
    const res = (await UsersApi.data("/user/all/products")) || [];
    if (res) {
      this.setState({ ...this.state, products: res === "Error" ? [] : res });
    }
  }

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="dashboard" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Products Available</h3>
                    <TextField
                      name="drug_name"
                      variant="outlined"
                      label="Search Product"
                      style={{
                        width: "15%",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Product Trade Name</td>
                          <td>Product Generic Name</td>
                          <td>Product Description</td>
                          <td>Quantity</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.products.length === 0 ? (
                          <tr>
                            <td>No Product Exists</td>
                          </tr>
                        ) : (
                          this.state.products.map((v, i) => {
                            return (
                              <>
                                <tr key={i}>
                                  <td>{v.product_generic_name}</td>
                                  <td>{v.product_generic_name}</td>
                                  <td>{v.product_description_name}</td>
                                  <td>{v.product_qty}</td>
                                  <td>
                                    <Link
                                      to={`/edit-product?product-id=${v.product_id}`}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                  </td>
                                  <td>
                                    <Button variant="contained" color="primary">
                                      Details
                                    </Button>
                                  </td>
                                </tr>
                              </>
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

export default AllProducts;
