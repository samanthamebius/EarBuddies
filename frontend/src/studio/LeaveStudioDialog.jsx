import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './Popup.module.css';
import leaveIcon from "../assets/studio/leaveGroupIcon.png"

export default function LeaveStudioDialog() {
    return(
        <Dialog  open={true} fullWidth maxWidth="md">
            <div className={styles.dialogHeader}>
                <img className={styles.headerIcon} src={leaveIcon}/>
                <h1 className={styles.heading}>Leave Studio</h1>
            </div>
            
            <DialogContent className={styles.dialogContent}>
                <div className={styles.dialogHeader}>
                    <h2 className={styles.subheading}> Assign a new host before leaving</h2>
                </div>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Button variant="contained" sx={{ color: '#606060'}} className={styles.greyButton} >Cancel</Button>
                    <Button variant="contained" className={styles.purpleButton} >Leave Studio</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}