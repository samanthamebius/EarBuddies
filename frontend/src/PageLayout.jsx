import React from "react";
import styles from './PageLayout.module.css';
import profilePicture from './assets/accountIconPLACEHOLDER.png';
import logo from './assets/earBuddiesLogoWithName.png';
import upArrow from './assets/dropdownUpArrow.png';
import downArrow from './assets/dropdownDownArrow.png';
import { NavLink, Outlet } from "react-router-dom";

import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import profileIcon from './assets/profileIcon.png'
import logoutIcon from './assets/logoutIcon.png'
import darkmodeIcon from './assets/darkmodeIcon.png'

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
            <CustomizedMenus/>
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

export function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.dropdown}>
      <Button
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        border-radius="10px"
        onClick={handleClick}
        className={styles.button}
      >
        <img src={profilePicture} className={styles.profile_picture} />
        <p className={styles.username}>Username </p>
        {anchorEl ? <img src={upArrow} className={styles.arrow}/> : <img src={downArrow} className={styles.arrow}/>}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
            <img src={profileIcon} className={styles.icon}/>
            <profileIcon/>
            <NavLink to="./profile" className={styles.menu_item}>View Profile</NavLink>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
            <img src={darkmodeIcon} className={styles.icon} />
          <p className={styles.menu_item}>Dark Mode</p>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
            <img src={logoutIcon} className={styles.icon}/>
            <NavLink to="./login" className={styles.menu_item}>Log Out</NavLink>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}