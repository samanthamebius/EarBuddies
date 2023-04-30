// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example
import { Container, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import styles from './SearchBar.module.css';

function SearchBar({label}) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#CA3FF3',
      },
    },
  });

  return (
    <Container disableGutters={true} className={styles.searchBar}>
      <ThemeProvider theme={theme}>
        <TextField
        color="secondary"
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
            <SearchRoundedIcon style={{ color: "#757575" }} position="start" className={styles.searchIcon}/>
          ),
        }}
        InputLabelProps={{
          shrink: focused || searchTerm.length > 0,
          style: {marginLeft: searchTerm || focused  ? 0 : 30 }
        }} />
      </ThemeProvider>
      
    </Container>
  );
}

export default SearchBar; 