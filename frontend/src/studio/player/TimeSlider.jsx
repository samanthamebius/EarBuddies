import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import styles from '../StudioPage.module.css';
import { StyledSlider } from './StyledSlider';

export function TimeSlider(props) {
    const { player, queueIsEmpty, isHost } = props;
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    // PUT THIS BACK IN
    // useEffect(() => {
    // 	const fetchDuration = async () => {
    // 		const track = await axios.get(`${BASE_URL}/api/spotify/songinfo`);
    // 		setDuration(Math.round(track.data.item.duration_ms / 1000));
    // 	};
    // 	fetchDuration();
    // }, []);

    // useEffect(() => {
    // 	const fetchPosition = async () => {
    // 		axios.get(`${BASE_URL}/api/spotify/songinfo`).then((response) => {
    // 			setPosition(Math.round(response.data.progress_ms / 1000));
    // 		});
    // 	};
    // 	fetchPosition();

    // 	// Polling mechanism to continuously update position
    // 	const interval = setInterval(fetchPosition, 1000);

    // 	// Cleanup interval on component unmount
    // 	return () => clearInterval(interval);
    // }, []);

    const TinyText = styled(Typography)({
        fontSize: '0.75rem',
        opacity: 0.38,
        fontWeight: 500,
        letterSpacing: 0.2,
        color: 'white',
    });

    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    const handleChange = (event, newValue) => {
        setPosition(newValue);
        if (player) {
            player.seek(newValue * 1000);
        }
    };

    return (
        <div className={styles.time}>
            <StyledSlider
                aria-label='time-indicator'
                size='small'
                value={position}
                min={0}
                step={1}
                max={duration}
                color='secondary'
                onChange={isHost ? () => handleChange : undefined}
                style={{
                    pointerEvents: queueIsEmpty ? 'none' : 'auto',
                    marginLeft: 15,
                    width: '334px',
                }}
                disabled={!isHost}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: -2,
                }}>
                <TinyText style={{ marginLeft: 10 }}>{formatDuration(position)}</TinyText>
                <TinyText style={{ marginRight: 10 }}>
                    -{formatDuration(duration - position)}
                </TinyText>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: -1,
                }}></Box>
        </div>
    );
}

export default TimeSlider;
