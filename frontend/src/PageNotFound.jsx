import React from "react";
import styles from './shared/ConfirmationDialog.module.css';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function PageNotFound({ errorType }) {
  const navigate = useNavigate();

  const logout = () => {
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	localStorage.removeItem("expires_in");
	localStorage.removeItem("current_user_id");
  }

  let errorMessage;
  let redirectPath;
  let buttonText;

  if (errorType === "404") {
    errorMessage = "Oops! The page you're looking for doesn't exist";
    redirectPath = "/";
    buttonText = "Back to home"
  } else if (errorType === "400") {
    errorMessage = "Oops! An error occurred while communicating with spotify";
    logout();
    redirectPath = "/login";
    buttonText = "Please login again"
  } else {
    // Default to 500 error if no error type is specified
    errorMessage = "Oops! Something went wrong on our end";
    logout();
    redirectPath = "/login";
    buttonText = "Please login again"
  }

  return (
    <div className={styles.spacing}>
        <div className={styles.icon}>
            <ErrorOutlineRoundedIcon fontSize={'large'} style={{ color: '#B03EEE'}}/>
        </div>
        <h1 style={{display: 'flex', justifyContent: 'center', fontSize: '26px'}} className={styles.sectionHeading}>
            {errorMessage}
        </h1>
        <Button 
            sx={{ fontWeight: 600, fontSize: '16px', marginTop: '15px' }} 
            variant='contained' 
            onClick={() => navigate(redirectPath)}>{buttonText}
        </Button>
    </div>
  );
}

export default PageNotFound;