import React, { useState } from "react";
import styles from './PageLayout.module.css';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

import { sizing } from '@mui/system';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import logo from './assets/shared/earBuddiesLogo.png';
import useGet from "./useGet";
import profileIcon from './assets/profilepic.png'

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
      <NavLink to=".">
        <div className={styles.navLink}>
          <img src={logo} className={styles.logo} />
          <h1 className={styles.brandName}>EAR BUDDIES</h1>
        </div>
      </NavLink>
      <DropdownMenu />
    </header>
  );

}

function UserInfo() {
  const current_user_id = localStorage.getItem("current_user_id");
  const id = JSON.parse(current_user_id);

  if (!current_user_id) {
    return <p>Could not load user</p>;
  }

  const access_token = localStorage.getItem("access_token");

  const {
    data: user,
    isLoading: userIsLoading,
    refresh: refreshUser } = useGet(`/api/user/${id}`, [], access_token);

  if (userIsLoading) {
    return <p>Loading...</p>;
  } else if (!user) {
    return <p>Could not load user</p>;
  } else {
    var profilePicture = "";
    var username = "";
    try {
      profilePicture = user[0].profilePic;
      username = user[0].userDisplayName;
    } catch (error) {
      console.log(error)
    }
    return (
      <div style={{ display: 'flex' }}>
        <img src={profilePicture} className={styles.profile_picture} />
        <p className={styles.username}>{username} </p>
      </div>
    );
  }
}

/**
 * Checks if user is logged in, if not, redirects to login page
 */
function login() {
  const access_token = localStorage.getItem("access_token");
  const code = new URLSearchParams(window.location.search).get("code");
  const current_user_id = localStorage.getItem("current_user_id");
  if (access_token == null) {
    //check for code
    if (code == null) {
      //reroute to login page
      window.location.href = "/login";
      return;
    }
  }
  useAuth(access_token, code, current_user_id);
  const current_user = localStorage.getItem("current_user_id");
}

export function DropdownMenu() {
  const [isOpen, setOpen] = useState(null);
  const [isInProfle, setInProfile] = useState(false);
  const [isInDarkMode, setInDarkMode] = useState(false);
  const [isInLogOut, setInLogOut] = useState(false);

  const navigate = useNavigate();
  const open = Boolean(isOpen);

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    setInProfile(false)
    setInDarkMode(false)
    setInDarkMode(false)
  };

  const handleLogout = () => {
    handleClose
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("current_user_id");

    navigate("/login");
  };

  login();
  const toggleProfile = () => { setInProfile(!isInProfle) };
  const toggleDarkMode = () => { setInDarkMode(!isInDarkMode) };
  const toggleLogOut = () => { setInLogOut(!isInLogOut) };

  return (
    <div className={styles.dropdown}>

      <Button onClick={handleClick} className={styles.button}>
        <UserInfo />
        {/* <img src={profileIcon} className={styles.profile_picture} /> */}
        {/* <p className={styles.username}>Username </p> */}
        {/* {isOpen ? <img src={upArrow} className={styles.arrow} /> : <img src={downArrow} className={styles.arrow} />} */}
      </Button>

      <Menu
        anchorEl={isOpen}
        open={open}
        onClose={handleClose}
      >
        <NavLink to="./profile">
          <MenuItem className={styles.menu_item} onClick={handleClose} onMouseEnter={toggleProfile} onMouseLeave={toggleProfile}>
            <PersonRoundedIcon className={styles.icon} style={{ color: isInProfle ? "#B03EEE" : "#757575" }} />
            <p className={styles.menu_title}>View Profile</p>
          </MenuItem>
        </NavLink>

        <MenuItem className={styles.menu_item} onClick={handleClose} onMouseEnter={toggleDarkMode} onMouseLeave={toggleDarkMode}>
          <DarkModeRoundedIcon className={styles.icon} style={{ color: isInDarkMode ? "#B03EEE" : "#757575" }} />
          <p className={styles.menu_title}>Dark Mode</p>
        </MenuItem>

        <MenuItem className={styles.menu_item} onClick={handleLogout} onMouseEnter={toggleLogOut} onMouseLeave={toggleLogOut}>
          <LogoutRoundedIcon className={styles.icon} style={{ color: isInLogOut ? "#B03EEE" : "#757575" }} />
          <p className={styles.menu_title}>Log Out</p>
        </MenuItem>

      </Menu>
    </div>
  );
}