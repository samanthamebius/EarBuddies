// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example

import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './SearchBar.module.css';
import { sizing } from '@mui/system';
import axios from "axios";
import { List, ListItem, ListItemText, ListItemAvatar, IconButton, Avatar } from '@mui/material';
import { useEffect } from "react";
import React from 'react';

function SearchBar({ label }) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (event) => {
    event.persist();
    setSearchTerm(event.target.value);
    console.log(searchTerm)
    if (searchTerm.trim().length > 0) {
      try {
        axios.get(`${BASE_URL}/api/spotify/search/${searchTerm}`)
          .then((response) => {
            setSearchResults(response.data);
          })
      }
      catch (error) {
        console.log(error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    return () => {
      // clear search results when the input field is unmounted
      setSearchResults([]);
    };
  }, []);

  function displayText(result) {
    if (result.type === "audiobook") {
      return `${result.name} - ${result.authors}`
    }
    else if (result.type === "track") {
      return `${result.name} - ${result.artists}`
    }
    else {
      return `${result.name}`
    }
  }


  return (
    <Container disableGutters={true} className={styles.searchBar}>
      <TextField
        id="search"
        type="search"
        label={label}
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onCancelSearch={() => setSearchTerm("")}
        fullWidth
        InputProps={{
          startAdornment: (
            <SearchRoundedIcon color="action" position="start" className={styles.searchIcon} />
          ),
        }}
        InputLabelProps={{
          shrink: focused || searchTerm.length > 0,
          style: { marginLeft: searchTerm || focused ? 0 : 30 }
        }}
      />
      <List className={styles.listContainer}>
        {searchResults.map((result) => (
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="more options">
                <MoreHorizIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar><img src={result.image} /></Avatar>
            </ListItemAvatar>
            <ListItemText primary={displayText(result)} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default SearchBar; 