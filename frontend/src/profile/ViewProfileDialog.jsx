import styles from './ViewProfileDialog.module.css';
import React, { useEffect, useState, useRef } from 'react';
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
import DeleteAccountDialog from './DeleteAccountDialog';

export default function ViewProfileDialog({ isViewProfileOpen, handleViewProfileClose }) {
    // temporary - change AnacondaAvatar with actual profile image
    const [displayPhoto, setDisplayPhoto] = useState(AnacondaAvatar); 
    
    const [displayName, setDisplayName] = useState('username');
    const [isInDisplayName, setInDisplayName] = useState(false);
    const [isInDisplayPhoto, setInDisplayPhoto] = useState(false);
    const [isAvatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
    const [isDeleteAccountOpen, setDeleteAccountOpen] = useState(false);

	const handleDeleteAccountOpen = () => {
		setDeleteAccountOpen(true);
	};

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

    return(
        <>
            <DeleteAccountDialog 
                isDeleteAccountOpen={isDeleteAccountOpen}
                handleDeleteAccountClose={() => setDeleteAccountOpen(false)}
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
                        <Button size={'large'} sx={{ fontWeight: 600, color: '#757575' }} variant='contained' className={styles.linkButton} onClick={onClose}>Link To Spotify Account</Button>
                        <h2 className={styles.sectionHeading}></h2>
                        <Button size={'large'} sx={{ fontWeight: 600, color: '#757575' }} variant='contained' className={styles.linkButton} onClick={handleDeleteAccountOpen}>Delete Ear Buddies Account</Button>
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