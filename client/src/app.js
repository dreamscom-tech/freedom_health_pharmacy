import React, { Component } from "react";
import user from "./app_config";
import Dispenser from "./users_routes/dispenser";
import Cashier from "./users_routes/cashier";
import Admin from "./users_routes/admin";
import Login from "./components/Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user,
    };
  }

  render() {
    if (user.user_role === "admin") {
      return <Admin />;
    } else if (user.user.user_role === "dispenser") {
      return <Dispenser />;
    } else if (user.user.user_role === "cashier") {
      return <Cashier />;
    } else {
      return <Login />;
    }
  }
}

export default App;
