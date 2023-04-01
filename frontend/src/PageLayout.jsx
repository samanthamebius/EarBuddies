import React from "react";
import styles from './PageLayout.module.css';
import { NavLink, Outlet } from "react-router-dom";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import profilePicture from './assets/nav_menu/accountIconPLACEHOLDER.png';
import logo from './assets/nav_menu/earBuddiesLogoWithName.png';

import profileIcon from './assets/nav_menu/profileIcon.png'
import logoutIcon from './assets/nav_menu/logoutIcon.png'
import darkmodeIcon from './assets/nav_menu/darkmodeIcon.png'

import upArrow from './assets/nav_menu/dropdownUpArrow.png';
import downArrow from './assets/nav_menu/dropdownDownArrow.png';

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
            <DropdownMenu/>
        </header>
    );
}

export function DropdownMenu() {
  const [isOpen, setOpen] = React.useState(null);
  const open = Boolean(isOpen);
  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  return (
    <div className={styles.dropdown}>

      <Button onClick={handleClick} className={styles.button}>
        <img src={profilePicture} className={styles.profile_picture} />
        <p className={styles.username}>Username </p>
        {isOpen ? <img src={upArrow} className={styles.arrow}/> : <img src={downArrow} className={styles.arrow}/>}
      </Button>

      <Menu
        anchorEl={isOpen}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
            <img src={profileIcon} className={styles.icon}/>
            <profileIcon/>
            <NavLink to="./profile" className={styles.menu_item}>View Profile</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
            <img src={darkmodeIcon} className={styles.icon} />
            <p className={styles.menu_item}>Dark Mode</p>
        </MenuItem>

        <MenuItem onClick={handleClose}>
            <img src={logoutIcon} className={styles.icon}/>
            <NavLink to="./login" className={styles.menu_item}>Log Out</NavLink>
        </MenuItem>

      </Menu>
    </div>
  );
}