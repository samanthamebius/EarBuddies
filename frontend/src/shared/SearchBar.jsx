// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example

import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './SearchBar.module.css';
import { sizing } from '@mui/system';
import axios from "axios";
import { List, ListItem, ListItemText, ListItemAvatar, IconButton, Avatar } from '@mui/material';
import React from 'react';

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

function SearchBar({ label }) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    console.log(searchTerm)
    try {
      axios.get(`${BASE_URL}/api/spotify/search/${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);
        })
    }
    catch (error) {
      console.log(error);
    }
  };

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
      <List>
        {generate(
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <MoreHorizIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                {searchResults.map((result) => (
                  <img src={result.image} />
                ))}
              </Avatar>
            </ListItemAvatar>
            {searchResults.map((result) => (
              <ListItemText primary={result.name} />
            ))}
          </ListItem>,
        )}
      </List>
    </Container>
  );
}

export default SearchBar; 