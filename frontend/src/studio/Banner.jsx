import styles from './Banner.module.css';
import React, { useState } from 'react';
import StudioMenu from './StudioMenu';
import ListenerIcons from '../shared/ListenerIcons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

/**
 * A Banner component that displays studio information and provides options for controlling the studio.
 * @param {string} id - The ID of the studio.
 * @param {Object} studio - The studio object.
 * @param {Object} socket - The socket object.
 * @returns {JSX.Element} - The Banner component JSX.
 */
export default function Banner({ id, studio, socket }) {
    const navigate = useNavigate();

    if (!studio) {
        return <p>Could not load studio</p>;
    }

    const studioName = studio.studioName;
    const backgroundImage = IMAGE_BASE_URL + studio.studioPicture;

    const isHost =
        studio.studioHost === localStorage.getItem('current_user_id').replace(/"/g, '');

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/api/studio/${id}`);
        navigate('/');
        window.location.reload(false);
    };

    {/* Manage toggling who can add listeners to a studio */}
    const [controlEnabled, toggleControl] = useState(studio.studioControlHostOnly);
    const handleControlToggle = () => {
        toggleControl((current) => !current);
        studio = axios.post(`${BASE_URL}/api/studio/${id}/toggle`);
    };

    const users = studio.studioUsers;
    const isAlone = users.length <= 1 ? true : false;
    const isListening = studio.studioIsActive;

    return (
        <div
            className={styles.banner}
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1 className={styles.bannerStudioName}>{studioName}</h1>

            <div className={styles.bannerlisteners}>
                <ListenerIcons
                    studioUsers={users}
                    isListening={isListening}
                    isHomeCard={false}
                />
            </div>
            <div className={styles.menu}>
                <StudioMenu
                    controlEnabled={controlEnabled}
                    handleControlToggle={handleControlToggle}
                    handleDelete={handleDelete}
                    id={id}
                    studio={studio}
                    socket={socket}
                    isHost={isHost}
                    studioUsers={users}
                    isAloneInStudio={isAlone}
                />
            </div>
        </div>
    );
}
