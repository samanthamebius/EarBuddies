import React from "react";
import styles from './PageLayout.module.css';
import { NavLink, Outlet } from "react-router-dom";

export default function PageLayout() {
    return (
        <React.Fragment>
            <NavMenu />
            <div className="container">
                <Outlet />
            </div>
        </React.Fragment>
    )
}

function NavMenu() {
    return (
        <header className={styles.navmenu}>
            <NavLink to="." >Home</NavLink>
        </header>
    );
}