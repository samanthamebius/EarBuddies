import {Button, List } from "@mui/material";
import styles from '../createstudio/CreateStudioDialog.module.css';
import React, { useEffect, useState } from "react";
import SearchBar from "../shared/SearchBar";
import { ListItem, ListItemText, ListItemAvatar, Avatar} from "@mui/material";
import ClearRounded from "@mui/icons-material/ClearRounded";
import axios from "axios";

export default function AddListenersBlock() {

  const [listenerSearchResults, setListenerSearchResults] = useState([]);
  const [displayedSearchResults, setDisplayedSearchResults] = useState([]);
  const [listeners, setListeners] = useState([]);
  const id = '6459c055ca78bfdbbe1c736e';
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect( () => {
    async function fetchStudioData() {
      const studio = await axios.get(`${BASE_URL}/api/studio/${id}`);
      const existingListeners = studio.data[0].studioUsers;
      console.log("LISTENERS " + existingListeners);
      setListeners(existingListeners);
    } fetchStudioData();
    
  }, [listeners])

  useEffect(() => {
    const difference = listenerSearchResults.filter(x => !listeners.some(y => y._id === x._id));
    setDisplayedSearchResults(difference);
  }, [listenerSearchResults, listeners])

  function addListener(listener) {
    const isFound = listeners.some(obj => {
      if (obj === listener) {
        return true;
      }
    });

    if (!isFound) {
      setListeners(oldListeners => [...oldListeners, listener]);
    }
  }

  function removeListener(listener) {
    setListeners((oldListeners) =>
      oldListeners.filter((oldListener) => oldListener !== listener)
    );
  }

  return (
    <div>
        {/* Add Listeners */}
    <h2 className={styles.sectionHeading}>Add Listeners</h2>
    <SearchBar
      searchType={"users"}
      label={"Search using Spotify username ..."}
      studioId={""}
      setResults={setListenerSearchResults}
      studio={""} />

    {/* Map search results */}
    {displayedSearchResults.length > 0 ? <List className={styles.searchResults}>
      {displayedSearchResults.map((listener, i) => (
        <ListItem
          key={i}
          secondaryAction={
            <Button
              edge="end"
              aria-label="more options"
              sx={{ fontWeight: 600 }}
              variant="contained"
              onClick={() => addListener(listener)}>
              Add
            </ Button>
          }>
          <ListItemAvatar>
            <Avatar>
              <img className={styles.image} src={listener.profilePicture} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={listener.userDisplayName} />
        </ListItem>
      ))}
    </List> : null}

    {/* Map Listeners */}
    {listeners.length > 0 ?
      <>
        <h2 className={styles.sectionHeading}>Listeners</h2>
        <List className={styles.listeners}>
          {listeners.map((listener, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <ClearRounded
                  edge="end"
                  style={{ color: "#757575" }}
                  className={styles.clearIcon}
                  onClick={() => removeListener(listener)} />
              }>
              <ListItemAvatar>
                <Avatar>
                  <img className={styles.image} src={listener.profilePicture} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={listener.userDisplayName} />
            </ListItem>
          ))}
        </List>
      </> : null}
    </div>
  );
}