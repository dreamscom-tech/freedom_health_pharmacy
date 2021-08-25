import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "../app.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import Dashboard from "../Routes/admin/Dashboard";
import NewProduct from "../Routes/admin/NewProduct";
import NewSupplier from "../Routes/admin/NewSupplier";
import NewCustomer from "../Routes/admin/NewCustomer";
import NewUser from "../Routes/admin/NewUser";
import NewSale from "../Routes/admin/Newsale";
import AllProducts from "../Routes/admin/allProducts";
import NewPurchase from "../Routes/admin/new_purchase";
import Product from "../Routes/admin/product";
import Edit from "../Routes/admin/editProduct";
import Finance from "../Routes/admin/finance";
import Reports from "../Routes/admin/reports";
import NotFound from "../components/404";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/new-product" exact component={NewProduct} />
            <Route path="/new-supplier" exact component={NewSupplier} />
            <Route path="/new-customer" exact component={NewCustomer} />
            <Route path="/new-user" exact component={NewUser} />
            <Route path="/new-purchase" exact component={NewPurchase} />
            <Route path="/new-sale" exact component={NewSale} />
            <Route path="/all-products" exact component={AllProducts} />
            <Route path="/product" exact component={Product} />
            <Route path="/edit-product" exact component={Edit} />
            <Route path="/finance" exact component={Finance} />
            <Route path="/reports" exact component={Reports} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Admin;
