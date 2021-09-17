// import React, { Component } from "react";
// import {
//   TextField,
//   Snackbar,
//   Button,
//   IconButton,
//   Select,
//   InputLabel,
//   FormControl,
//   MenuItem,
// } from "@material-ui/core";
// import MuiAlert from "@material-ui/lab/Alert";
// import Nav from "./components/Nav";
// import Header from "./components/Header";
// import FormsApi from "../../api/forms";
// import UsersApi from "../../api/users";
// import "../../design/forms.css";

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

// class EditProduct extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//       message: "Please Wait...",
//       messageState: "",
//       product: {},
//       units: [],
//       new_unit_error: false,
//       selling_units: [],
//     };
//     this.product();
//   }

//   async product() {
//     let id = parseInt(
//       new URLSearchParams(window.location.search).get("product-id")
//     );
//     const [res] = await UsersApi.data(`/user/all/product/${id}`);
//     if (res) {
//       this.setState({ ...this.state, product: res === "Error" ? {} : res });
//     }
//   }

//   handleSubmit = async (e) => {
//     e.preventDefault();
//     this.setState({ ...this.state, open: true, messageState: "info" });
//     const fd = new FormData(e.target);
//     let _fcontent = {};
//     fd.forEach((value, key) => {
//       _fcontent[key] = value;
//     });
//     let id = parseInt(
//       new URLSearchParams(window.location.search).get("product-id")
//     );
//     _fcontent["units"] = this.state.units;
//     let api = new FormsApi();
//     let res = await api.post(`/user/sale/edit_product/${id}`, _fcontent);
//     if (res.status === true) {
//       this.setState({
//         ...this.state,
//         message: res.data,
//         messageState: "success",
//       });
//       setTimeout(() => {
//         window.location.reload();
//       }, 200);
//     } else {
//       this.setState({
//         ...this.state,
//         message: res.data,
//         messageState: "error",
//       });
//     }
//   };

//   closePopUp = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     this.setState({ ...this.state, open: false });
//   };

//   render() {
//     return (
//       <>
//         <Snackbar
//           anchorOrigin={{
//             vertical: "top",
//             horizontal: "center",
//           }}
//           open={this.state.open}
//           autoHideDuration={5000}
//           onClose={this.closePopUp}
//           action={
//             <React.Fragment>
//               <IconButton
//                 size="small"
//                 aria-label="close"
//                 color="inherit"
//                 onClick={this.closePopUp}
//               >
//                 <i className="las la-times"></i>
//               </IconButton>
//             </React.Fragment>
//           }
//         >
//           <Alert onClose={this.closePopUp} severity={this.state.messageState}>
//             {this.state.message}
//           </Alert>
//         </Snackbar>
//         <input type="checkbox" id="nav-toggle" defaultChecked />
//         <Nav active="dashboard" />
//         <div className="main-content">
//           <Header />
//           <main>
//             <div className="fullwidth-ctr">
//               <div className="projects">
//                 <form
//                   className="card"
//                   autoComplete="off"
//                   onSubmit={this.handleSubmit}
//                 >
//                   <div
//                     className=""
//                     style={{
//                       borderBottom: "1px solid #f0f0f0",
//                       padding: "1rem",
//                     }}
//                   >
//                     <div className="form-header-ctr">
//                       <div className="">
//                         <h3>Edit Product</h3>
//                       </div>
//                       <div className="">
//                         <Button
//                           aria-describedby={this.id}
//                           variant="contained"
//                           color="primary"
//                           style={{ marginInline: 10 }}
//                           onClick={() => {
//                             window.location.reload();
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           type="submit"
//                           aria-describedby={this.id}
//                           variant="contained"
//                           color="primary"
//                           style={{ marginInline: 10 }}
//                         >
//                           Save
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <div>
//                       <div className="inputCtr">
//                         <h4>Medicine Entry</h4>
//                         <div className="inputs_ctr_np">
//                           <div className="inputs_left_np">
//                             <TextField
//                               name="generic_name"
//                               variant="outlined"
//                               helperText="Generic Name"
//                               value={this.state.product.product_generic_name}
//                               style={{
//                                 width: "75%",
//                                 margin: "20px",
//                               }}
//                               onChange={(e) => {
//                                 this.setState({
//                                   ...this.state,
//                                   product: {
//                                     ...this.state.product,
//                                     product_generic_name: e.target.value,
//                                   },
//                                 });
//                               }}
//                             />
//                             <TextField
//                               name="description"
//                               variant="outlined"
//                               helperText="Medicine Description"
//                               value={
//                                 this.state.product.product_description_name
//                               }
//                               style={{
//                                 width: "75%",
//                                 margin: "20px",
//                               }}
//                               onChange={(e) => {
//                                 this.setState({
//                                   ...this.state,
//                                   product: {
//                                     ...this.state.product,
//                                     product_description: e.target.value,
//                                   },
//                                 });
//                               }}
//                             />
//                           </div>
//                           <div className="inputs_right_np">
//                             <h4 style={{ margin: "20px" }}>Selling Units</h4>
//                             <div className="tbl_ctr_np">
//                               <table width="100%">
//                                 <thead>
//                                   <tr>
//                                     <td>Selling Unit</td>
//                                     <td>Quantity</td>
//                                     <td>Retail</td>
//                                     <td>Wholesale</td>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {this.state.units.length === 0 ? (
//                                     <tr>
//                                       <td>No Selected Units</td>
//                                     </tr>
//                                   ) : (
//                                     this.state.units.map((v, i) => {
//                                       return (
//                                         <tr key={i}>
//                                           <td>
//                                             <FormControl
//                                               error={this.state.new_unit_error}
//                                               variant="standard"
//                                               label="supplier"
//                                               style={{
//                                                 width: "95%",
//                                               }}
//                                             >
//                                               <InputLabel id="selling_unit">
//                                                 {i === 0
//                                                   ? `Smallest Unit`
//                                                   : `Unit ${i + 1}`}
//                                               </InputLabel>
//                                               <Select
//                                                 inputProps={{
//                                                   name: "selling_unit",
//                                                 }}
//                                                 label={
//                                                   i === 0
//                                                     ? `Smallest Unit`
//                                                     : `Unit ${i + 1}`
//                                                 }
//                                                 id="select_selling_unit"
//                                                 defaultValue=""
//                                                 onChange={(e) => {
//                                                   let units_change =
//                                                     this.state.units;
//                                                   units_change[i].selling_unit =
//                                                     e.target.value;
//                                                   this.setState({
//                                                     ...this.state,
//                                                     units: units_change,
//                                                   });
//                                                 }}
//                                               >
//                                                 {this.state.selling_units
//                                                   .length === 0
//                                                   ? "No Unit Added"
//                                                   : this.state.selling_units.map(
//                                                       (v, i) => {
//                                                         return (
//                                                           <>
//                                                             <MenuItem
//                                                               value={
//                                                                 v.unit_name
//                                                               }
//                                                               key={i}
//                                                             >
//                                                               {v.unit_name}
//                                                             </MenuItem>
//                                                           </>
//                                                         );
//                                                       }
//                                                     )}
//                                               </Select>
//                                             </FormControl>
//                                           </td>
//                                           <td>
//                                             <TextField
//                                               multiline={true}
//                                               variant="standard"
//                                               defaultValue={i === 0 ? "1" : ""}
//                                               label={
//                                                 i === 0
//                                                   ? `Quantity`
//                                                   : `Quantity In Unit ${i}`
//                                               }
//                                               onChange={(e) => {
//                                                 let units_change =
//                                                   this.state.units;
//                                                 units_change[i].qty =
//                                                   e.target.value;
//                                                 this.setState({
//                                                   ...this.state,
//                                                   units: units_change,
//                                                 });
//                                               }}
//                                               style={{
//                                                 width: "95%",
//                                               }}
//                                             />
//                                           </td>
//                                           <td>
//                                             <TextField
//                                               variant="standard"
//                                               label="Retail"
//                                               error={this.state.new_unit_error}
//                                               onChange={(e) => {
//                                                 let units_change =
//                                                   this.state.units;
//                                                 units_change[i].retail =
//                                                   e.target.value;
//                                                 this.setState({
//                                                   ...this.state,
//                                                   units: units_change,
//                                                 });
//                                               }}
//                                               style={{
//                                                 width: "95%",
//                                               }}
//                                             />
//                                           </td>
//                                           <td>
//                                             <TextField
//                                               variant="standard"
//                                               label="Wholesale"
//                                               error={this.state.new_unit_error}
//                                               onChange={(e) => {
//                                                 let units_change =
//                                                   this.state.units;
//                                                 units_change[i].wholesale =
//                                                   e.target.value;
//                                                 this.setState({
//                                                   ...this.state,
//                                                   units: units_change,
//                                                 });
//                                               }}
//                                               style={{
//                                                 width: "95%",
//                                               }}
//                                             />
//                                           </td>
//                                         </tr>
//                                       );
//                                     })
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                             <div
//                               className=""
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 width: "95%",
//                                 margin: "10px auto",
//                               }}
//                             >
//                               <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={() => {
//                                   if (this.state.units.length === 0) {
//                                     this.setState({
//                                       ...this.state,
//                                       units: [...this.state.units, { qty: 1 }],
//                                     });
//                                   } else if (this.state.units.length === 1) {
//                                     let units = this.state.units;
//                                     if (
//                                       !units[0].selling_unit ||
//                                       !units[0].qty ||
//                                       !units[0].retail ||
//                                       !units[0].wholesale
//                                     ) {
//                                       this.setState({
//                                         ...this.state,
//                                         new_unit_error: true,
//                                         open: true,
//                                         message: "Some Fields are missing",
//                                         messageState: "error",
//                                       });
//                                     } else {
//                                       this.setState({
//                                         ...this.state,
//                                         units: [...this.state.units, {}],
//                                         new_unit_error: false,
//                                       });
//                                     }
//                                   } else {
//                                     let units = this.state.units;
//                                     if (
//                                       units[units.length - 1].selling_unit &&
//                                       units[units.length - 1].qty &&
//                                       units[units.length - 1].retail &&
//                                       units[units.length - 1].wholesale
//                                     ) {
//                                       if (
//                                         parseInt(units[units.length - 1].qty) *
//                                           parseInt(
//                                             units[units.length - 2].retail
//                                           ) ===
//                                           parseInt(
//                                             units[units.length - 1].retail
//                                           ) ||
//                                         parseInt(units[units.length - 1].qty) *
//                                           parseInt(
//                                             units[units.length - 2].wholesale
//                                           ) ===
//                                           parseInt(
//                                             units[units.length - 1].wholesale
//                                           )
//                                       ) {
//                                         this.setState({
//                                           ...this.state,
//                                           units: [...this.state.units, {}],
//                                           new_unit_error: false,
//                                         });
//                                       } else {
//                                         this.setState({
//                                           ...this.state,
//                                           new_unit_error: true,
//                                           open: true,
//                                           message: "Unit Prices Mismatch",
//                                           messageState: "error",
//                                         });
//                                       }
//                                     } else {
//                                       this.setState({
//                                         ...this.state,
//                                         new_unit_error: true,
//                                         open: true,
//                                         message: "Some Fields are Missing",
//                                         messageState: "error",
//                                       });
//                                     }
//                                   }
//                                 }}
//                               >
//                                 New Unit
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </main>
//         </div>
//       </>
//     );
//   }
// }

// export default EditProduct;

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Nav from "./components/Nav";
import Header from "./components/Header";
import FormsApi from "../../api/forms";
import UsersApi from "../../api/users";
import "../../design/forms.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      open_dailog: false,
      message: "Please Wait...",
      messageState: "",
      suppliers: [],
      units: [],
      new_unit_error: false,
      empty_name_error: false,
      selling_units: [],
    };
    this.units();
  }

  async units() {
    const res = (await UsersApi.data("/user/all/units")) || [];
    if (res) {
      this.setState({
        ...this.state,
        selling_units: res === "Error" ? [] : res,
      });
    }
  }

  handleClose = () => {
    this.setState({ ...this.state, open_dailog: false });
  };

  handleUnit = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, open: true, messageState: "info" });
    const fd = new FormData(e.target);
    let content = {};
    fd.forEach((value, key) => {
      content[key] = value;
    });
    let api = new FormsApi();
    let res = await api.post("/user/admin/new_unit", content);
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
      if (!content["unit_name"]) {
        this.setState({
          ...this.state,
          open: true,
          message: "This field is missing",
          messageState: "error",
          empty_name_error: true,
        });
        return;
      }
    }
  };

  async product() {
    let id = parseInt(
      new URLSearchParams(window.location.search).get("product-id")
    );
    const res = await UsersApi.data(`/user/all/product/${id}`);
    if (res) {
      this.setState({ ...this.state, product: res === "Error" ? {} : [res] });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ ...this.state, open: true, messageState: "info" });
    const fd = new FormData(e.target);
    let _fcontent = {};
    fd.forEach((value, key) => {
      _fcontent[key] = value;
    });
    let id = parseInt(
      new URLSearchParams(window.location.search).get("product-id")
    );
    _fcontent["units"] = this.state.units;
    let api = new FormsApi();
    let res = await api.post(`/user/sale/edit_product/${id}`, _fcontent);
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

  // handleSubmit = async (e) => {
  //   e.preventDefault();
  //   this.setState({ ...this.state, open: true, messageState: "info" });
  //   const fd = new FormData(e.target);
  //   let _fcontent = {};
  //   fd.forEach((value, key) => {
  //     _fcontent[key] = value;
  //   });
  //   if (this.state.units.length === 0) {
  //     this.setState({
  //       ...this.state,
  //       open: true,
  //       message: "No Selling Units Registered",
  //       messageState: "error",
  //     });
  //     return;
  //   }
  //   if (!_fcontent["description"] || !_fcontent["generic_name"]) {
  //     this.setState({
  //       ...this.state,
  //       open: true,
  //       message: "Some fields are missing",
  //       messageState: "error",
  //       empty_name_error: true,
  //     });
  //     return;
  //   }
  //   _fcontent["units"] = this.state.units;
  //   _fcontent["date"] = Date.now();
  //   let api = new FormsApi();
  //   let res = await api.post("/user/sale/new_product", _fcontent);

  //   if (res.status === true) {
  //     this.setState({
  //       ...this.state,
  //       message: res.data,
  //       messageState: "success",
  //     });
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 200);
  //   } else {
  //     this.setState({
  //       ...this.state,
  //       message: res.data,
  //       messageState: "error",
  //     });
  //   }
  // };

  closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      open: false,
      message: "Please Wait...",
      messageState: "info",
      empty_name_error: false,
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
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            this.setState({
                              ...this.state,
                              open_dailog: true,
                            });
                          }}
                        >
                          Add Unit
                        </Button>
                      </div>
                      <div className="">
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginLeft: 10 }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h4>Medicine Entry</h4>
                        <div className="inputs_ctr_np">
                          <div className="inputs_left_np">
                            <TextField
                              error={this.state.empty_name_error}
                              name="generic_name"
                              variant="outlined"
                              label="Generic Name"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              error={this.state.empty_name_error}
                              name="description"
                              variant="outlined"
                              label="Medicine Description"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                          </div>
                          <div className="inputs_right_np">
                            <h4 style={{ margin: "20px" }}>Selling Units</h4>
                            <div className="tbl_ctr_np">
                              <table width="100%">
                                <thead>
                                  <tr>
                                    <td>Selling Unit</td>
                                    <td>Quantity</td>
                                    <td>Retail</td>
                                    <td>Wholesale</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.units.length === 0 ? (
                                    <tr>
                                      <td>No Selected Units</td>
                                    </tr>
                                  ) : (
                                    this.state.units.map((v, i) => {
                                      return (
                                        <tr key={i}>
                                          <td>
                                            <FormControl
                                              error={this.state.new_unit_error}
                                              variant="standard"
                                              label="supplier"
                                              style={{
                                                width: "95%",
                                              }}
                                            >
                                              <InputLabel id="selling_unit">
                                                {i === 0
                                                  ? `Smallest Unit`
                                                  : `Unit ${i + 1}`}
                                              </InputLabel>
                                              <Select
                                                inputProps={{
                                                  name: "selling_unit",
                                                }}
                                                label={
                                                  i === 0
                                                    ? `Smallest Unit`
                                                    : `Unit ${i + 1}`
                                                }
                                                id="select_selling_unit"
                                                defaultValue=""
                                                onChange={(e) => {
                                                  let units_change =
                                                    this.state.units;
                                                  units_change[i].selling_unit =
                                                    e.target.value;
                                                  this.setState({
                                                    ...this.state,
                                                    units: units_change,
                                                  });
                                                }}
                                              >
                                                {this.state.selling_units
                                                  .length === 0
                                                  ? "No Unit Added"
                                                  : this.state.selling_units.map(
                                                      (v, i) => {
                                                        return (
                                                          <MenuItem
                                                            value={v.unit_name}
                                                            key={i}
                                                          >
                                                            {v.unit_name}
                                                          </MenuItem>
                                                        );
                                                      }
                                                    )}
                                              </Select>
                                            </FormControl>
                                          </td>
                                          <td>
                                            <TextField
                                              multiline={true}
                                              variant="standard"
                                              defaultValue={i === 0 ? "1" : ""}
                                              label={
                                                i === 0
                                                  ? `Quantity`
                                                  : `Quantity In Unit ${i}`
                                              }
                                              onChange={(e) => {
                                                let units_change =
                                                  this.state.units;
                                                units_change[i].qty =
                                                  e.target.value;
                                                this.setState({
                                                  ...this.state,
                                                  units: units_change,
                                                });
                                              }}
                                              style={{
                                                width: "95%",
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <TextField
                                              variant="standard"
                                              label="Retail"
                                              error={this.state.new_unit_error}
                                              onChange={(e) => {
                                                let units_change =
                                                  this.state.units;
                                                units_change[i].retail =
                                                  e.target.value;
                                                this.setState({
                                                  ...this.state,
                                                  units: units_change,
                                                });
                                              }}
                                              style={{
                                                width: "95%",
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <TextField
                                              variant="standard"
                                              label="Wholesale"
                                              error={this.state.new_unit_error}
                                              onChange={(e) => {
                                                let units_change =
                                                  this.state.units;
                                                units_change[i].wholesale =
                                                  e.target.value;
                                                this.setState({
                                                  ...this.state,
                                                  units: units_change,
                                                });
                                              }}
                                              style={{
                                                width: "95%",
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div
                              className=""
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "95%",
                                margin: "10px auto",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  if (this.state.units.length === 0) {
                                    this.setState({
                                      ...this.state,
                                      units: [...this.state.units, { qty: 1 }],
                                    });
                                  } else if (this.state.units.length === 1) {
                                    let units = this.state.units;
                                    if (
                                      !units[0].selling_unit ||
                                      !units[0].qty ||
                                      !units[0].retail ||
                                      !units[0].wholesale
                                    ) {
                                      this.setState({
                                        ...this.state,
                                        new_unit_error: true,
                                        open: true,
                                        message: "Some Fields are missing",
                                        messageState: "error",
                                      });
                                    } else {
                                      this.setState({
                                        ...this.state,
                                        units: [...this.state.units, {}],
                                        new_unit_error: false,
                                      });
                                    }
                                  } else {
                                    let units = this.state.units;
                                    if (
                                      units[units.length - 1].selling_unit &&
                                      units[units.length - 1].qty &&
                                      units[units.length - 1].retail &&
                                      units[units.length - 1].wholesale
                                    ) {
                                      if (
                                        parseInt(units[units.length - 1].qty) *
                                          parseInt(
                                            units[units.length - 2].retail
                                          ) ===
                                          parseInt(
                                            units[units.length - 1].retail
                                          ) ||
                                        parseInt(units[units.length - 1].qty) *
                                          parseInt(
                                            units[units.length - 2].wholesale
                                          ) ===
                                          parseInt(
                                            units[units.length - 1].wholesale
                                          )
                                      ) {
                                        this.setState({
                                          ...this.state,
                                          units: [...this.state.units, {}],
                                          new_unit_error: false,
                                        });
                                      } else {
                                        this.setState({
                                          ...this.state,
                                          new_unit_error: true,
                                          open: true,
                                          message: "Unit Prices Mismatch",
                                          messageState: "error",
                                        });
                                      }
                                    } else {
                                      this.setState({
                                        ...this.state,
                                        new_unit_error: true,
                                        open: true,
                                        message: "Some Fields are Missing",
                                        messageState: "error",
                                      });
                                    }
                                  }
                                }}
                              >
                                New Unit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>

        <Dialog
          open={this.state.open_dailog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Selling Unit</DialogTitle>
          <form onSubmit={this.handleUnit} autoComplete="off">
            <DialogContent>
              <DialogContentText>
                <TextField
                  error={this.state.empty_name_error}
                  name="unit_name"
                  variant="standard"
                  label="Unit Name"
                  style={{
                    width: "85%",
                    margin: "20px",
                  }}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
}

export default EditProduct;
