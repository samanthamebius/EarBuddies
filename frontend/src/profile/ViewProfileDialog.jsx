import styles from './ViewProfileDialog.module.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import useGet from '../hooks/useGet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfileDialog({
    isViewProfileOpen,
    handleViewProfileClose,
    handleViewProfileSave,
}) {
    const [displayPhoto, setDisplayPhoto] = useState();
    const [displayName, setDisplayName] = useState('username');
    const [isInDisplayName, setInDisplayName] = useState(false);
    const [isInDisplayPhoto, setInDisplayPhoto] = useState(false);
    const [isAvatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [spotifyPhoto, setSpotifyPhoto] = useState('');

    const handleConfirmDeleteOpen = () => {
        setConfirmDeleteOpen(true);
    };

    // get user info
    const current_user_id = localStorage.getItem('current_user_id');
    const id = JSON.parse(current_user_id);
    const { data: user, isLoading: userIsLoading } = useGet(`/api/user/${id}`);
    useEffect(() => {
        if (user) {
            setDisplayName(user.userDisplayName);
            setDisplayPhoto(user.profilePic);
            setSpotifyPhoto(user.spotifyPic);
        }
    }, [user]);

    const avatars = [
        spotifyPhoto,
        AnacondaAvatar,
        BeaverAvatar,
        BoarAvatar,
        BunnyAvatar,
        CatAvatar,
        ClownFishAvatar,
        CowAvatar,
        GiraffeAvatar,
        JaguarAvatar,
        JellyfishAvatar,
        MonkeyAvatar,
        PandaAvatar,
        PelicanAvatar,
        PenguinAvatar,
        ScorpionAvatar,
        SharkAvatar,
        SheepAvatar,
        SnailAvatar,
        TurtleAvatar,
        WhaleAvatar,
    ];

    const toggleInDisplayName = () => {
        setInDisplayName(!isInDisplayName);
    };
    const toggleInDisplayPhoto = () => {
        setInDisplayPhoto(!isInDisplayPhoto);
    };

    const openAvatarOptions = () => {
        setAvatarOptionsOpen(true);
    };
    const closeAvatarOptions = () => {
        setAvatarOptionsOpen(false);
    };

    const onClose = () => {
        setAvatarOptionsOpen(false);
        handleViewProfileClose();
    };
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/api/user/${id}`).then((res) => {
            console.log(res);
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('current_user_id');
        navigate('/');
    };

    const handleAccountLink = () => {
        window.open('https://www.spotify.com/us/account/overview/', '_blank');
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}/api/user/${id}`, {
            userDisplayName: displayName,
            profilePic: displayPhoto,
        });
        setAvatarOptionsOpen(false);
        handleViewProfileClose();
        handleViewProfileSave();
    };

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#CA3FF3',
            },
        },
    });

    return (
        <>
            <ConfirmationDialog
                isOpen={isConfirmDeleteOpen}
                handleClose={() => setConfirmDeleteOpen(false)}
                handleAction={() => {
                    setConfirmDeleteOpen(false);
                    handleDelete();
                }} //TO DO: replace with delete functionality
                message={'Are you sure you want to delete your Ear Buddies Account?'}
                actionText={'Delete'}
            />
            <div>
                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={isViewProfileOpen}
                    onClose={onClose}
                    PaperProps={{ style: { backgroundColor: 'var(--dialogColor' } }}>
                    <h1 className={styles.heading}>My Profile</h1>
                    <DialogContent>
                        <h2 className={styles.sectionHeading}>Display Name</h2>
                        <ThemeProvider theme={theme}>
                            <TextField
                                color='secondary'
                                onMouseEnter={toggleInDisplayName}
                                onMouseLeave={toggleInDisplayName}
                                value={displayName}
                                required
                                margin='dense'
                                id='name'
                                type='text'
                                fullWidth
                                variant='outlined'
                                onChange={(event) => setDisplayName(event.target.value)}
                                className={styles.textfield}
                                autoComplete='off'
                                InputProps={{
                                    style: { color: 'var(--headingColor)' },
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <EditRoundedIcon
                                                style={{
                                                    pointerEvents: 'none',
                                                    color: isInDisplayName
                                                        ? '#B03EEE'
                                                        : 'var(--iconColor)',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ThemeProvider>
                        <h2 className={styles.sectionHeading}>Display Photo</h2>

                        <div
                            className={styles.displayPhotoContainer}
                            onMouseEnter={toggleInDisplayPhoto}
                            onMouseLeave={toggleInDisplayPhoto}>
                            <div
                                onClick={
                                    isAvatarOptionsOpen
                                        ? closeAvatarOptions
                                        : openAvatarOptions
                                }
                                className={styles.currentDisplayPhotoContainter}>
                                <img
                                    src={displayPhoto}
                                    className={styles.displayPhoto}
                                />
                                <div className={styles.editIconContainer}>
                                    <EditRoundedIcon
                                        style={{
                                            color: isInDisplayPhoto
                                                ? '#B03EEE'
                                                : 'var(--iconColor)',
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.hiddenPhotoSection}
                                style={{ display: isAvatarOptionsOpen ? '' : 'none' }}>
                                <div className={styles.avatars}>
                                    {Array.isArray(avatars)
                                        ? avatars.map((avatar, i) => (
                                              <img
                                                  style={{
                                                      border:
                                                          avatar === displayPhoto
                                                              ? 'solid 2px #CA3FF3'
                                                              : '',
                                                  }}
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
                        <Button
                            size={'large'}
                            sx={{ fontWeight: 600, color: '#757575' }}
                            variant='contained'
                            className={styles.linkButton}
                            onClick={handleAccountLink}>
                            <OpenInNewRoundedIcon className={styles.buttonIcon} />
                            Link To Spotify Account
                        </Button>
                        <h2 className={styles.sectionHeading}></h2>
                        <Button
                            size={'large'}
                            sx={{ fontWeight: 600, color: '#757575' }}
                            variant='contained'
                            className={styles.linkButton}
                            onClick={handleConfirmDeleteOpen}>
                            <DeleteRoundedIcon className={styles.buttonIcon} />
                            Delete Ear Buddies Account
                        </Button>
                    </DialogContent>
                    <DialogActions
                        sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}
                        className={styles.buttons}>
                        <Button
                            sx={{ fontWeight: 600, color: '#757575' }}
                            variant='contained'
                            className={styles.cancelButton}
                            onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            sx={{ fontWeight: 600 }}
                            variant='contained'
                            className={styles.createButton}
                            onClick={handleSave}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
