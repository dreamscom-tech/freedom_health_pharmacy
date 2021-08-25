import React, { Component } from "react";
import {
  TextField,
  Snackbar,
  Button,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Nav from "./components/Nav";
import Header from "./components/Header";
import FormsApi from "../../api/forms";
import "../../design/forms.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NewCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "Please Wait...",
      messageState: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, open: true, messageState: "info" });
    const fd = new FormData(e.target);
    let _fcontent = {};
    fd.forEach((value, key) => {
      _fcontent[key] = value;
    });
    let api = new FormsApi();
    let res = await api.post("/user/pharmacy/new_customer", _fcontent);
    if (res.status === true) {
      this.setState({
        ...this.state,
        message: res.data,
        messageState: "success",
      });
    } else {
      this.setState({
        ...this.state,
        message: res.data,
        messageState: "error",
      });
    }
  };

  closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  render() {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={this.state.open}
          autoHideDuration={5000}
          onClose={this.closePopUp}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.closePopUp}
              >
                <i className="las la-times"></i>
              </IconButton>
            </React.Fragment>
          }
        >
          <Alert onClose={this.closePopUp} severity={this.state.messageState}>
            {this.state.message}
          </Alert>
        </Snackbar>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="dashboard" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <form
                  className="card"
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                >
                  <div
                    className=""
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: "1rem",
                    }}
                  >
                    <div className="form-header-ctr">
                      <div className="">
                        <h3>New Customer</h3>
                      </div>
                      <div className="">
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginInline: 10 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginInline: 10 }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h4>Customer Details</h4>
                        <div className="inputs_ctr">
                          <div className="inpts_on_left">
                            <TextField
                              name="surname"
                              variant="outlined"
                              label="Surname"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              name="first_name"
                              variant="outlined"
                              label="First Name"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              name="phone_contact"
                              variant="outlined"
                              label="Phone Contact"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                            <FormControl
                              variant="outlined"
                              label="type"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="type">
                                Type Of Customer
                              </InputLabel>
                              <Select
                                inputProps={{ name: "type" }}
                                label="type"
                                id="select_type"
                                defaultValue=""
                              >
                                <MenuItem value="1">Retailer</MenuItem>
                                <MenuItem value="2">Final User</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                          <div className="inpts_center">
                            <FormControl
                              variant="outlined"
                              label="address"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="address">Address</InputLabel>
                              <Select
                                inputProps={{ name: "address" }}
                                label="address"
                                id="select_address"
                                defaultValue=""
                              >
                                <MenuItem value="1">Aduku</MenuItem>
                                <MenuItem value="2">Lira</MenuItem>
                                <MenuItem value="3">Gulu</MenuItem>
                                <MenuItem value="4">Apac</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField
                              name="location"
                              variant="outlined"
                              label="Location"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ..
                </form>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
}

export default NewCustomer;
