import React from "react";
import styles from './StudioPage.module.css'
import SearchBar from "../shared/SearchBar";

export default function SongSelection() {
  
  return (
    <div className={styles.queue}>
      <SongSearch />
      <Queue />
    </div>
  );
}

function SongSearch() {
  return (
    <div>
      <h1>What's Next?</h1>
      <SearchBar label={"Search Spotify"}></SearchBar>
    </div>
  );
}
  
function Queue() {
  return (
    <div>
    <h1>Coming Up:</h1>
  </div>
  )
}

