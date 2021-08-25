import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBlock: 20 }}>404</h1>
        <span style={{ marginBlock: 10 }}>
          This Page Was Not Found On The Server
        </span>
        <Link to="/">
          <Button
            variant="contained"
            color="primary"
            style={{ marginBlock: 20 }}
          >
            <span style={{ fontSize: "17.5px", marginRight: "10px" }}>
              <span className="las la-home"></span>
            </span>
            Home
          </Button>
        </Link>
      </div>
    );
  }
}

export default NotFound;
