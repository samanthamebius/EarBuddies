import * as React from "react";
import useAuth from "../useAuth";
import StudioCard from "./StudioCard";
import styles from "./HomePage.module.css";
import Button from "@mui/material/Button";
import { style } from "@mui/system";
import SoundWavesGradient from "../assets/soundwavesgradient.png";
import SearchBar from "../shared/SearchBar";

/**
 * Checks if user is logged in, if not, redirects to login page
 */
function login() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken == null) {
    //check for code
    const code = new URLSearchParams(window.location.search).get("code");
    if (code == null) {
      //reroute to login page
      window.location.href = "/login";
    } else {
      //use code to get access token
      useAuth(code);
    }
  }
}

function HomePage() {
	login();
  
	return (
		<div className={styles.container}>
			<div className={styles.containerChild} style={{ marginRight: "45px" }}>
				<div className={styles.header}>
					<h1 className={styles.headings}>My Studios</h1>
					<div className={styles.headerChild}>
						<Button variant="contained" size="large" className={styles.button}>
							+ Create Studio
						</Button>
					</div>
				</div>
				<SearchBar label={"Search My Studios ..."} />
				<div className={styles.cardContainer}>
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
					<StudioCard />
				</div>
			</div>
			<div className={styles.containerChild}>
				<div className={styles.header}>
					<h1 className={styles.headings}>Listening Now</h1>
					<div className={styles.headerChild}>
						<img src={SoundWavesGradient} className={styles.soundWaves}></img>
					</div>
				</div>
				<SearchBar label={"Search Studios Listening Now ..."} />
				<div className={styles.cardContainer}>
					<StudioCard />
					<StudioCard />
				</div>
			</div>
		</div>
	);
} export default HomePage;
