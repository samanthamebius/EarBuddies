import React from "react";
import styles from './shared/ConfirmationDialog.module.css';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div className={styles.spacing}>
            <div className={styles.icon}>
                <ErrorOutlineRoundedIcon fontSize={'large'} style={{ color: '#B03EEE'}}/>
            </div>
            <h1 style={{display: 'flex', justifyContent: 'center', fontSize: '26px'}} className={styles.sectionHeading}>
                Oops! The page you're looking for doesn't exist
            </h1>
            <Button sx={{ fontWeight: 600, fontSize: '16px', marginTop: '15px' }} variant='contained' onClick={() => navigate('/')}>Back to home</Button>
        </div>
            
    );
}

export default PageNotFound;