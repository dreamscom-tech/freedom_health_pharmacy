import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Nav from "./components/Nav";
import Header from "./components/Header";
import UsersApi from "../../api/users";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class AllProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElDrugs: null,
      batches: [],
      loading: true,
      open: false,
      open_del: false,
      message: "Please Wait...",
      messageState: "",
      batch_id: "",
    };
    this.batches();
  }

  handleOpenActions = (e) => {
    this.setState({ ...this.state, AnchorEl: e.currentTarget });
  };
  handleOpenActionsDrugs = (e) => {
    this.setState({ ...this.state, AnchorElDrugs: e.currentTarget });
  };
  handleCloseActions = () => {
    this.setState({ ...this.state, AnchorEl: null });
  };
  handleCloseActionsDrugs = () => {
    this.setState({ ...this.state, AnchorElDrugs: null });
  };

  async batches() {
    const res = (await UsersApi.data("/user/all/batches")) || [];
    if (res) {
      this.setState({
        ...this.state,
        loading: false,
        batches: res === "Error" ? [] : res,
      });
    }
  }

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };

  handleDelete = async () => {
    this.setState({ ...this.state, open_del: true, messageState: "info" });
    const res = await UsersApi.data(
      `/user/all/delete_batch/${this.state.batch_id}`
    );
    if (res.status === true) {
      this.setState({
        ...this.state,
        message: res.data,
        messageState: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 200);
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
    this.setState({
      ...this.state,
      open_del: false,
      message: "Please Wait...",
      messageState: "info",
    });
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
                <div className="card">
                  <div className="card-header">
                    <TextField
                      className="text_field_all_products"
                      name="drug_name"
                      variant="outlined"
                      label="Search Batch"
                      style={{
                        width: "15%",
                      }}
                      onKeyUp={async (e) => {
                        const res = e.target.value
                          ? (await UsersApi.data(
                              `/user/all/search_batch/${e.target.value}`
                            )) || []
                          : (await UsersApi.data("/user/all/products")) || [];
                        if (res !== "Error") {
                          this.setState({
                            ...this.state,
                            loader: false,
                            batches: res === "Error" ? [] : res,
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Product Generic Name</td>
                          <td>Product Description</td>
                          <td>Batch Number</td>
                          <td>Batch Quantity</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.batches.length === 0 ? (
                          this.state.loading ? (
                            <tr>
                              <td>
                                <CircularProgress size={25} />
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td>No Batch Exists</td>
                            </tr>
                          )
                        ) : (
                          this.state.batches.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.product_generic_name}</td>
                                <td>{v.product_description_name}</td>
                                <td>{v.batch_no}</td>
                                <td>{v.batch_qty}</td>
                                <td></td>
                                <td>
                                  <Button
                                    variant="contained"
                                    style={{ color: "red" }}
                                    onClick={() => {
                                      this.setState({
                                        ...this.state,
                                        open: true,
                                        batch_id: v.batch_id,
                                      });
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
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
        {this.state.batch_id ? (
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Want to Delete Product Batch?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This removes a specific batch number. Press OK and Continue.
                This process is Irreversible
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleDelete} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default AllProducts;
