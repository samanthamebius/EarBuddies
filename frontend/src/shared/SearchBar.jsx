// Credit to https://frontendshape.com/post/react-mui-5-search-bar-example

import { Container, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRounded from "@mui/icons-material/ClearRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./SearchBar.module.css";
import { sizing } from "@mui/system";
import axios from "axios";
import {
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	styled,
} from "@mui/material";
import React from "react";

const StyledMenu = styled(Menu)({
	"& .MuiPaper-root": {
		boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
	},
});

function SearchBar({ label }) {
	const [focused, setFocused] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (event) => {
		// handle menu item click
		handleCloseMenu();
	};

	const handleCancel = () => {
		setSearchTerm("");
		setSearchResults([]);
	};

	useEffect(() => {
		if (searchTerm.trim().length > 0) {
			try {
				axios
					.post(
						`${BASE_URL}/api/spotify/search/${searchTerm}`,
						localStorage.getItem("refresh_token")
					)
					.then((response) => {
						setSearchResults(response.data);
					});
			} catch (error) {
				console.log(error);
			}
		} else {
			setSearchResults([]);
		}
	}, [searchTerm]);

	function displayText(result) {
		if (result.type === "audiobook") {
			return `${result.name} - ${result.authors}`;
		} else if (result.type === "track") {
			return `${result.name} - ${result.artists}`;
		} else {
			return `${result.name}`;
		}
	}

	return (
		<Container disableGutters={true} className={styles.searchBar}>
			<TextField
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
						<SearchRoundedIcon
							color="action"
							position="start"
							className={styles.searchIcon}
						/>
					),
					endAdornment: (
						<InputAdornment position="end">
							{searchTerm.length > 0 && (
								<ClearRounded
									color="action"
									className={styles.clearIcon}
									onClick={handleCancel}
								/>
							)}
						</InputAdornment>
					),
				}}
				InputLabelProps={{
					shrink: focused || searchTerm.length > 0,
					style: { marginLeft: searchTerm || focused ? 0 : 30 },
				}}
			/>
			<List className={styles.listContainer}>
				{searchResults.map((result) => (
					<ListItem
						secondaryAction={
							<IconButton
								edge="end"
								aria-label="more options"
								onClick={handleOpenMenu}
							>
								<MoreHorizIcon />
							</IconButton>
						}
					>
						<StyledMenu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleCloseMenu}
						>
							<MenuItem onClick={handleMenuItemClick}>Add to queue</MenuItem>
							<MenuItem onClick={handleMenuItemClick}>Play</MenuItem>
						</StyledMenu>
						<ListItemAvatar>
							<Avatar>
								<img src={result.image} />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={displayText(result)} />
					</ListItem>
				))}
			</List>
		</Container>
	);
}

export default SearchBar;
