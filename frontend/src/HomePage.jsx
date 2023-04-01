import React from "react";
// import useAuth from "./useAuth";
import StudioCard from "./StudioCard";
import styles from './HomePage.module.css';

function HomePage({ code }) {
  // const accessToken = useAuth(code);
  return (
    <div className={styles.row}>
      <div className={styles.column}>
        <h1 className={styles.headings}>My Studios</h1>
        <StudioCard />
        <StudioCard />
      </div>
      <div className={styles.column}>
        <h1 className={styles.headings}>Listening Now</h1>
        <StudioCard />
        <StudioCard />
      </div>
    </div>
  );
}

export default HomePage; 