import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NewHostSelection({ newHost, setNewHost, isHostErrorMessage, studioUsers, studio_id }) {
    const [listeners, setListeners] = useState([]);

    useEffect(() => {
		if (!studioUsers || !Array.isArray(studioUsers)) {
			console.log("no studio users")
			return;
		}
		async function fetchUserData() {
		const promises = studioUsers.map(user => axios.get(`${BASE_URL}/api/user/${user}`));
		const userDataList = await Promise.all(promises);
		setListeners(userDataList.map(response => response.data));
		}
		fetchUserData();
	}, [studioUsers]);

    return(
        <div>
            <div className={styles.listenerList}>

                {listeners.map((listener) => (
                    <ListenerListItem key={listener.username} 
                        listener={listener} 
                        isNewHost={listener.username === newHost}
                        setNewHost={setNewHost}
                    />
                ))}
            </div>
            {isHostErrorMessage && <p className={styles.helperText}>You must select a host</p> }
        </div>
    )
}

function ListenerListItem ({ listener, isNewHost, setNewHost }) {
    const handleClick = () => {
      setNewHost(listener.username);
    };
  
    return (
      <div className={styles.listenerListItem} onClick={handleClick}>
        <img src={listener.profilePic}/>
        <p>{listener.userDisplayName}</p>
        {isNewHost ?
            <StarRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
        :
            <StarBorderRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
        }
      </div>
    );
};