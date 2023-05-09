import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './Popup.module.css';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from "axios";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

import AddListenersBlock from '../shared/AddListenersBlock';

export default function ManageListenersDialog({ isManListDialogOpened, handleCloseManListDialog, studio }) {

    const [host, setHost] = useState(null);

    const handleClose = () => { handleCloseManListDialog(false) };
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
		async function fetchStudioData() {
            const hostId = studio.studioHost; 
            const host = await axios.get(`${BASE_URL}/api/user/${hostId}`);
            console.log("HOST " + host.data.userDisplayName);
            setHost(host.data);
        }
		fetchStudioData();
	}, []);

    return (
        <Dialog  open={isManListDialogOpened} onClose={handleCloseManListDialog} fullWidth maxWidth="sm"
        PaperProps={{ style: { padding: '20px', backgroundColor: '#F5F5F5' }}}>
        <div className={styles.dialogHeader}>
            <GroupsIcon style={{ color:  "#757575", fontSize:40}} />
            <h1 className={styles.heading}>Manage Listeners</h1>
        </div>

        <ListenerListItem listener={host}/>
        <AddListenersBlock/>
        
        <DialogContent className={styles.dialogContent}>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} 
                onClick={handleClose}>Close</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
    );
}

function ListenerListItem ({ listener }) {
  
    return (
      <div className={styles.listenerListItem}>
        <img src={listener.profilePic}/>
        <p>{listener.userDisplayName}</p>
         <StarRoundedIcon className={styles.hostIcon} style={{ color: "#757575", fontSize: "30px" }} />
    
      </div>
    );
};