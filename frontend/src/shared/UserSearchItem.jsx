import { List, ListItem, ListItemText, ListItemAvatar, Button, Avatar, Menu, MenuItem, styled } from "@mui/material";
import styles from "./SearchBar.module.css";

export default function UserSearchItem({ result }) {
    return (
        <ListItem
            secondaryAction={
                <Button
                    edge="end"
                    aria-label="more options"
                    sx={{ fontWeight: 600 }}
                    variant="contained">
                    Add
                </Button>
            }>
            <ListItemAvatar>
                <Avatar>
                    <img className={styles.image} src={result.profilePicture} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={result.userDisplayName} />
        </ListItem>
    )
};