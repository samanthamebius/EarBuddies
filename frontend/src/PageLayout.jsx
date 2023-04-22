import React from "react";
import styles from './PageLayout.module.css';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import logo from './assets/nav_menu/earBuddiesLogoWithName.png';

import profileIcon from './assets/nav_menu/profileIcon.png'
import logoutIcon from './assets/nav_menu/logoutIcon.png'
import darkmodeIcon from './assets/nav_menu/darkmodeIcon.png'

import upArrow from './assets/nav_menu/dropdownUpArrow.png';
import downArrow from './assets/nav_menu/dropdownDownArrow.png';
import useGet from "./useGet";

export default function PageLayout() {
  return (
    <React.Fragment>
      <NavMenu />
      <div className="container">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

function NavMenu() {
  return (
    <header className={styles.navmenu}>
      <NavLink to="." ><img src={logo} className={styles.logo} /></NavLink>
      <DropdownMenu />
    </header>
  );
}

function UserInfo() {
  console.log("in user info")
  const {
    data: user,
    isLoading: userIsLoading,
    refresh: refreshUser } = useGet("/user", []);

  console.log('user: ' + user);

  if (userIsLoading) {
    return <p>Loading...</p>;
  } else {
    const profilePicture = user[0].profilePic;
    const username = user[0].userDisplayName;
    return (
      <div>
        <img src={profilePicture} className={styles.profile_picture} />
        <p className={styles.username}>{username} </p>
      </div>
    );
  }


}



export function DropdownMenu() {
  const [isOpen, setOpen] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(isOpen);
  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");

    navigate("/login");
  };

  return (
    <div className={styles.dropdown}>

      <Button onClick={handleClick} className={styles.button}>
        {/* <UserInfo /> */}
        {/* <img src={profileIcon} className={styles.profile_picture} /> */}
        {/* <p className={styles.username}>Username </p> */}
        {isOpen ? <img src={upArrow} className={styles.arrow} /> : <img src={downArrow} className={styles.arrow} />}
      </Button>

      <Menu
        anchorEl={isOpen}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <img src={profileIcon} className={styles.icon} />
          <profileIcon />
          <NavLink to="./profile" className={styles.menu_item}>View Profile</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <img src={darkmodeIcon} className={styles.icon} />
          <span className={styles.menu_item}>Dark Mode</span>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <img src={logoutIcon} className={styles.icon} />
          <p onClick={handleLogout} className={styles.menu_item}>Log Out</p>
        </MenuItem>

      </Menu>
    </div>
  );
}