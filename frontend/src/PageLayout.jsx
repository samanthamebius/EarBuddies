import React from "react";
import styles from './PageLayout.module.css';
import icon from './assets/accountIconPLACEHOLDER.png';
import logo from './assets/earBuddiesLogoWithName.png';
import arrow from './assets/dropdownDownArrow.png';
import { NavLink, Outlet } from "react-router-dom";

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
            <AccountDropdown></AccountDropdown>
        </header>
    );
}

function AccountDropdown() {
    return (
        <div className={styles.dropdown}>
            <img src={icon} className={styles.icon}/>
            <p className={styles.username}>username</p>
            <img src={arrow} className={styles.arrow}/>
        </div>
    )
}