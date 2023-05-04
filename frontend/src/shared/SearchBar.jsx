import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRounded from "@mui/icons-material/ClearRounded";
import styles from "./SearchBar.module.css";
import axios from "axios";
import React from "react";

function SearchBar({ label, searchType, studioId, setResults }) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#CA3FF3',
      },
    },
  });

  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const username = localStorage.getItem("current_user_id");

  const searchUsers = () => {
    try {
      axios
        .get(
          `${BASE_URL}/api/user/users/${username.replace(/['"]+/g, '')}/${searchTerm}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          return <p>Could not load search</p>;
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const searchStudioUsers = () => {
    try {
      axios
        .get(
          `${BASE_URL}/api/user/users/${username.replace(/['"]+/g, '')}/${searchTerm}/${studioId}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          return <p>Could not load search</p>;
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const searchStudios = () => {
    try {
      axios
        .get(
          `${BASE_URL}/api/user/${username.replace(/['"]+/g, '')}/studios/${searchTerm}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          return <p>Could not load search</p>;
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const searchActiveStudios = () => {
    try {
      axios
        .get(
          `${BASE_URL}/api/user/${username.replace(/['"]+/g, '')}/active/${searchTerm}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          return <p>Could not load search</p>;
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const handleCancel = () => {
    setSearchTerm("");
    // setResults([]);
  };

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      if (searchType === "users") {
        searchUsers();
      } else if (searchType === "studios") {
        searchStudios();
      } else if (searchType === "activeStudios") {
        searchActiveStudios();
      } else if (searchType === "studioUsers") {
        searchStudioUsers();
      }
    } else {
      // setResults([]);
    }
  }, [searchTerm]);

  return (
    <Container disableGutters={true} className={styles.searchBar}>
      <ThemeProvider theme={theme}>
        <TextField
          color="secondary"
          id="search"
          type="text"
          label={label}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          fullWidth
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon style={{ color: "#757575" }} position="start" className={styles.searchIcon} />
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm.length > 0 && (
                  <ClearRounded
                    style={{ color: "#757575" }}
                    className={styles.clearIcon}
                    onClick={handleCancel}
                  />
                )}
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: focused || searchTerm.length > 0,
            style: { marginLeft: searchTerm || focused ? 0 : 30 }
          }} />
      </ThemeProvider>
    </Container>
  );
}

export default SearchBar;