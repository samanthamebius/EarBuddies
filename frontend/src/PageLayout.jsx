import React from "react";
import styles from './PageLayout.module.css';
import profilePicture from './assets/nav_menu/accountIconPLACEHOLDER.png';
import logo from './assets/nav_menu/earBuddiesLogoWithName.png';
import upArrow from './assets/nav_menu/dropdownUpArrow.png';
import downArrow from './assets/nav_menu/dropdownDownArrow.png';
import { NavLink, Outlet } from "react-router-dom";

import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import profileIcon from './assets/nav_menu/profileIcon.png'
import logoutIcon from './assets/nav_menu/logoutIcon.png'
import darkmodeIcon from './assets/nav_menu/darkmodeIcon.png'

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

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 10,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 14,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

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

      <StyledMenu
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

      </StyledMenu>
    </div>
  );
}