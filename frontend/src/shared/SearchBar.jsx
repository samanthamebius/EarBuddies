// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example

import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import styles from './SearchBar.module.css';
import { sizing } from '@mui/system';

function SearchBar({label}) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
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
            <SearchRoundedIcon color="action" position="start" className={styles.searchIcon}/>
          ),
        }}
        InputLabelProps={{
          shrink: focused || searchTerm.length > 0,
          style: {marginLeft: searchTerm || focused  ? 0 : 30 }
        }}
      />
    </Container>
  );
}

export default SearchBar; 