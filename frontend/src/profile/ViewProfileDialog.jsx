import styles from './ViewProfileDialog.module.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InputAdornment from '@mui/material/InputAdornment';
import AnacondaAvatar from '../assets/profile/anaconda.png'; //https://www.freepik.com/
import BeaverAvatar from '../assets/profile/beaver.png';
import BoarAvatar from '../assets/profile/boar.png';
import BunnyAvatar from '../assets/profile/bunny.png';
import CatAvatar from '../assets/profile/cat.png';
import ClownFishAvatar from '../assets/profile/clown-fish.png';
import CowAvatar from '../assets/profile/cow.png';
import ElephantAvatar from '../assets/profile/elephant.png';
import GiraffeAvatar from '../assets/profile/giraffe.png';
import JaguarAvatar from '../assets/profile/jaguar.png';
import JellyfishAvatar from '../assets/profile/jellyfish.png';
import MonkeyAvatar from '../assets/profile/monkey.png';
import PandaAvatar from '../assets/profile/panda.png';
import PelicanAvatar from '../assets/profile/pelican.png';
import PenguinAvatar from '../assets/profile/penguin.png';
import ScorpionAvatar from '../assets/profile/scorpion.png';
import SharkAvatar from '../assets/profile/shark.png';
import SheepAvatar from '../assets/profile/sheep.png';
import SnailAvatar from '../assets/profile/snail.png';
import TurtleAvatar from '../assets/profile/turtle.png';
import WhaleAvatar from '../assets/profile/whale.png';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import useGet from '../hooks/useGet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfileDialog({ isViewProfileOpen, handleViewProfileClose }) {
    const [displayPhoto, setDisplayPhoto] = useState(AnacondaAvatar); 
    const [displayName, setDisplayName] = useState('username');
    const [isInDisplayName, setInDisplayName] = useState(false);
    const [isInDisplayPhoto, setInDisplayPhoto] = useState(false);
    const [isAvatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const handleConfirmDeleteOpen = () => {
		setConfirmDeleteOpen(true);
	};

    // get user info
    const current_user_id = localStorage.getItem("current_user_id");
	const id = JSON.parse(current_user_id);
    const { data: user, isLoading: userIsLoading } = useGet(`/api/user/${id}`);
    console.log(user)
    console.log(id)
    useEffect(() => {
        if (user) {
            setDisplayName(user.userDisplayName);
            setDisplayPhoto(user.profilePic);
        }
    }, [user]);

    const avatars = [AnacondaAvatar, BeaverAvatar, BoarAvatar, BunnyAvatar, CatAvatar, ClownFishAvatar, ElephantAvatar,
        CowAvatar, GiraffeAvatar, JaguarAvatar, JellyfishAvatar, MonkeyAvatar, PandaAvatar, PelicanAvatar, 
        PenguinAvatar, ScorpionAvatar, SharkAvatar, SheepAvatar, SnailAvatar, TurtleAvatar, WhaleAvatar
    ]
    
    const toggleInDisplayName = () => { setInDisplayName(!isInDisplayName) };
    const toggleInDisplayPhoto = () => { setInDisplayPhoto(!isInDisplayPhoto) };

    const openAvatarOptions = () => { setAvatarOptionsOpen(true)};
    const closeAvatarOptions = () => { setAvatarOptionsOpen(false)};

    const onClose= () => {
        setAvatarOptionsOpen(false);
        handleViewProfileClose();
    }
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/api/user/${id}`).then((res) => {
			console.log(res);
		});
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("current_user_id");
		navigate("/");
    }

    const handleAccountLink = () => {
        window.open("https://www.spotify.com/us/account/overview/", "_blank");
    }

    return(
        <>
            <ConfirmationDialog 
                isOpen={isConfirmDeleteOpen}
                handleClose={() => setConfirmDeleteOpen(false)}
                handleAction={() => {setConfirmDeleteOpen(false); handleDelete();}} //TO DO: replace with delete functionality
                message={"Are you sure you want to delete your Ear Buddies Account?"}
                actionText={"Delete"}
            />
            <div>
                <Dialog fullWidth maxWidth='sm' open={isViewProfileOpen} onClose={onClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
                    <h1 className={styles.heading}>View Profile</h1>
                    <DialogContent>
                        <h2 className={styles.sectionHeading}>Display Name</h2>
                        <TextField 
                            onMouseEnter={toggleInDisplayName} 
                            onMouseLeave={toggleInDisplayName}
                            value={displayName}
                            required
                            margin='dense'
                            id='name'
                            type='text'
                            fullWidth
                            variant='outlined'
                            onChange={event => setDisplayName(event.target.value)}
                            className={styles.textfield}
                            autoComplete='off'
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <EditRoundedIcon style={{ color: isInDisplayName ? '#B03EEE' : '#757575'}}/>
                                    </InputAdornment>,
                            }}
                        />
                        <h2 className={styles.sectionHeading}>Display Photo</h2>
                        
                        <div 
                            className={styles.displayPhotoContainer}
                            onMouseEnter={toggleInDisplayPhoto} 
                            onMouseLeave={toggleInDisplayPhoto}
                        >
                            <div onClick={isAvatarOptionsOpen ? closeAvatarOptions : openAvatarOptions} className={styles.currentDisplayPhotoContainter} >
                                <img src={displayPhoto} className={styles.displayPhoto}/>
                                <div className={styles.editIconContainer}>
                                    <EditRoundedIcon style={{ color: isInDisplayPhoto ?  '#B03EEE' : '#757575'}}/>
                                </div>
                            </div>
                            <div className={styles.hiddenPhotoSection} style={{display: isAvatarOptionsOpen ? '' : 'none'}}>
                                <div className={styles.avatars} >
                                    {Array.isArray(avatars)
                                    ? avatars.map((avatar, i) => (
                                            <img
                                                style={{border: avatar === displayPhoto ? 'solid 2px #CA3FF3' : '' }}
                                                key={i} 
                                                src={avatar}
                                                className={styles.avatarOption}
                                                onClick={() => setDisplayPhoto(avatar)}
                                            />
                                    ))
                                    : null}
                                </div>
                            </div>
                        </div>
                        <h2 className={styles.sectionHeading}></h2>
                        <Button size={'large'} sx={{ fontWeight: 600, color: '#757575' }} variant='contained' className={styles.linkButton} onClick={handleAccountLink}>Link To Spotify Account</Button>
                        <h2 className={styles.sectionHeading}></h2>
                        <Button size={'large'} sx={{ fontWeight: 600, color: '#757575' }} variant='contained' className={styles.linkButton} onClick={handleConfirmDeleteOpen}>Delete Ear Buddies Account</Button>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
                    <Button sx={{ fontWeight: 600, color: '#757575' }} variant='contained' className={styles.cancelButton} onClick={onClose}>Close</Button>
                    <Button sx={{ fontWeight: 600 }} variant='contained' className={styles.createButton} onClick={onClose}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}