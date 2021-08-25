import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "../app.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import Dashboard from "../Routes/dispenser/Dashboard";
import NewSale from "../Routes/dispenser/Newsale";
import AllProducts from "../Routes/dispenser/allProducts";
import NewPurchase from "../Routes/dispenser/new_purchase";
import Product from "../Routes/dispenser/product";
import NotFound from "../components/404";

class Dispenser extends Component {
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
            <Route path="/new-sale" exact component={NewSale} />
            <Route path="/all-products" exact component={AllProducts} />
            <Route path="/new-purchase" exact component={NewPurchase} />
            <Route path="/product" exact component={Product} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Dispenser;
