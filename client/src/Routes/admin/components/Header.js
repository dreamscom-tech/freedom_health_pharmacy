import React, { useState } from "react";
import Avatar from "../../../assets/place-holder.jpg";
import {
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import user from "../../../app_config";
import { Logout } from "../../../components/Login";
function Header() {
  const [AnchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenActions = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <header>
        <h2>
          <label htmlFor="nav-toggle">
            <span className="las la-bars"></span>
          </label>
          <span className="health_unit_name">Freedom Health</span>
        </h2>
        {/* <div className="search-wrapper">
          <span className="las la-search"></span>
          <input type="search" name="" id="" placeholder="Search here" />
        </div> */}
        <div className="" style={{ display: "flex", alignItems: "center" }}>
          <div className="" style={{ fontSize: "42px", marginRight: 20 }}>
            <i className="las la-bell"></i>
          </div>
          <div
            className="user-wrapper"
            aria-controls="reception-actions"
            aria-haspopup="true"
            onClick={handleOpenActions}
            style={{ cursor: "pointer" }}
          >
            <img src={Avatar} alt="" width="40px" height="40px" />
            <div className="">
              <h4>{user.user.username}</h4>
              <small>{user.user.user_role}</small>
            </div>
          </div>
        </div>
      </header>

      <Menu
        id="reception-actions"
        anchorEl={AnchorEl}
        keepMounted
        disableScrollLock={true}
        open={Boolean(AnchorEl)}
        onClose={handleCloseActions}
      >
        <MenuItem onClick={handleCloseActions}>
          <span style={{ fontSize: 24, marginRight: 10 }}>
            <i className="las la-user-alt"></i>
          </span>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClickOpenDialog}>
          <span style={{ fontSize: 24, marginRight: 10 }}>
            <i className="las la-sign-out-alt"></i>
          </span>
          Log out
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Log Out</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Want to Log Out. Click 'Stay' to close, Log Out to Continue
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Stay
          </Button>
          <Button
            variant="contained"
            color="primary"
            autoFocus
            onClick={() => {
              Logout();
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;
