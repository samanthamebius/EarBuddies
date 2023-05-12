import React, { useState, useEffect } from 'react';
import styles from './Popup.module.css';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NewHostSelection({
    newHost,
    setNewHost,
    isHostErrorMessage,
    studioUsers,
}) {
    const [listeners, setListeners] = useState([]);

    useEffect(() => {
        if (!studioUsers || !Array.isArray(studioUsers)) {
            console.log('no studio users');
            return;
        }
        async function fetchUserData() {
            const promises = studioUsers.map((user) =>
                axios.get(`${BASE_URL}/api/user/${user}`)
            );
            const userDataList = await Promise.all(promises);

            const currentUser = localStorage.getItem('current_user_id').replace(/"/g, '');
            const potentialHosts = userDataList
                .map((response) => response.data)
                .filter((listener) => listener.username !== currentUser);
            //only show active users
            const activeHosts = potentialHosts.filter(
                (listener) => listener.userIsActive
            );
            setListeners(activeHosts);
        }
        fetchUserData();
    }, [studioUsers]);

    return (
        <div>
            <div className={styles.listenerList}>
                {listeners.map((listener) => (
                    <ListenerListItem
                        key={listener.username}
                        listener={listener}
                        isNewHost={listener.username === newHost}
                        setNewHost={setNewHost}
                    />
                ))}
            </div>
            {isHostErrorMessage && (
                <p className={styles.helperText}>You must select a host</p>
            )}
        </div>
    );
}

function ListenerListItem({ listener, isNewHost, setNewHost }) {
    const handleClick = () => {
        setNewHost(listener.username);
    };

    return (
        <div
            className={styles.listenerListItem}
            onClick={handleClick}>
            <img
                src={listener.profilePic}
                alt={'Profile picture of ' + listener.userDisplayName}
            />
            <p style={{ color: 'var(--headingColor)' }}>{listener.userDisplayName}</p>
            {isNewHost ? (
                <StarRoundedIcon
                    className={styles.hostIcon}
                    style={{ color: 'var(--iconColor)', fontSize: '30px' }}
                />
            ) : (
                <StarBorderRoundedIcon
                    className={styles.hostIcon}
                    style={{ color: 'var(--iconColor)', fontSize: '30px' }}
                />
            )}
        </div>
    );
}
