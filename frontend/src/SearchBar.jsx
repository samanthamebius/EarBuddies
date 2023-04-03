// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example

import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import styles from './SearchBar.module.css';
import { sizing } from '@mui/system';

function SearchBar({label}) {
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
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}

export default SearchBar; 