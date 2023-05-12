import React, { useContext, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './Chat.module.css';
import { useEffect } from 'react';
import { TextField, styled } from '@mui/material';
import ChatMessage from './ChatMessage';
import { useParams } from 'react-router-dom';
import PinnedMessage from './PinnedMessage';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { AppContext } from '../../AppContextProvider';
import axios from 'axios';
import QuickAddPill from './QuickAddPill';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        padding: '0',
        fontSize: '15px',
    },
    width: '100%',
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Chat(props) {
    const { socket } = props;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [expandedPinnedMessages, setExpandedPinnedMessages] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [nickname, setNickname] = useState('');
    const [nowPlaying, setNowPlaying] = useState({});
    const displayedPinnedMessages = expandedPinnedMessages
        ? pinnedMessages
        : pinnedMessages.slice(0, 1);
    const { username } = useContext(AppContext);
    const { id } = useParams();
    const room = id;
    const textInput = useRef(null);
    const messagesRef = useRef(null);

    // scroll to the bottom of the chat container when it's overflowed
    useEffect(() => {
        setTimeout(() => {
            messagesRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 100);
    }, [messages]);

    // Set the nickname of the user
    useEffect(() => {
        if (username) {
            axios
                .get(`${BASE_URL}/api/studio/${id}/${username}/nickname`)
                .then((response) => setNickname(response.data));
        }
    }, [username]);

    // reload the chat messages if the nickname of a user changes
    useEffect(() => {
        socket.on('receive_reload_chat_messages', (data) => {
            setMessages(data.updatedMessages.messages);
            setNickname(data.nickname);
        });
    }, [socket]);

    // Set previous messages
    useEffect(() => {
        axios.get(`${BASE_URL}/api/chat/all-messages/${id}`).then((response) => {
            response.data.messages.length > 0 && setMessages(response.data.messages);
            setPinnedMessages(response.data.pinnedMessages);
        });
    }, []);

    // continously set the live messages received
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            setMessages((messages) => [
                ...messages,
                {
                    id: data.id,
                    username: data.username,
                    displayName: data.nickname,
                    message: data.message,
                    isReply: data.isReply,
                    replyMessage: data?.replyMessage,
                },
            ]);
        });
    }, [socket]);

    // continously set the live messages received from currently playing
    useEffect(() => {
        socket.on('receive_user_currently_playing_song', (trackTitle) => {
            console.log(trackTitle);
            if (trackTitle) {
                const messageId = uuid();
                setMessages((messages) => [
                    ...messages,
                    {
                        id: messageId,
                        username: 'chat_bot',
                        displayName: 'chat_bot',
                        message: `Now playing: ${trackTitle}`,
                        isReply: false,
                        replyMessage: '',
                    },
                ]);
                // save the message to DB
                axios.put(`http://localhost:3000/api/chat/new-message/${id}`, {
                    id: messageId,
                    username: 'chat_bot',
                    displayName: 'chat_bot',
                    message: `Now playing: ${trackTitle}`,
                    isReply: false,
                    replyMessage: '',
                });
            }
        });
    }, [socket]);

    // continously set the pinned messages received
    useEffect(() => {
        socket.on('receive_pinned_message', (data) => {
            const { newMessage, pinnedMessages } = data;

            const messageExists = pinnedMessages.find(
                (message) => message.id === newMessage.id
            );

            if (!messageExists) {
                setPinnedMessages((pinnedMessages) => [
                    ...pinnedMessages,
                    {
                        id: newMessage.id,
                        message: newMessage.message,
                        username: newMessage.username,
                        displayName: newMessage.nickname,
                    },
                ]);
            }
        });
    }, [socket]);

    // remove pinned messages
    useEffect(() => {
        socket.on('receive_remove_pinned_message', (data) => {
            setPinnedMessages(() =>
                pinnedMessages.filter((message) => message.id !== data.newMessage.id)
            );
        });
    });

    // continously get the currently playing song to display quick add options
    useEffect(() => {
        socket.on('receive_currently_playing', (data) => {
            if (data) {
                setNowPlaying({
                    type: data?.type,
                    name: data?.name,
                    artist: `${data?.type === 'track' ? data?.artists[0]?.name : ''}`,
                    album: `${data?.type === 'track' ? data?.album?.name : ''}`,
                });
            }
        });
    }, [socket]);

    // user leaves the room when they navigate away
    useEffect(() => {
        return () => {
            socket.emit('leave_room', { nickname, room });
        };
    }, []);

    // send the message
    const handleSendMessage = async () => {
        const isReply = replyMessage !== '';
        const messageId = uuid();
        if (message !== '') {
            // send the message
            socket.emit('send_message', {
                room,
                id: messageId,
                username,
                nickname,
                message,
                isReply,
                replyMessage,
            });

            // save the message to DB
            await axios.put(`http://localhost:3000/api/chat/new-message/${id}`, {
                id: messageId,
                username: username,
                displayName: nickname,
                message: message,
                isReply: isReply,
                replyMessage: replyMessage,
            });
            setMessage('');
            setReplyMessage('');
        }
    };

    return (
        <div className={styles.chat}>
            <div className={styles.chatContent}>
                <div className={styles.pinnedMessages}>
                    <div className={styles.pinnedMessagesContent}>
                        {displayedPinnedMessages.map((message, index) => (
                            <PinnedMessage
                                key={index}
                                pinnedMessage={message}
                                room={room}
                                socket={socket}
                            />
                        ))}
                    </div>
                    {pinnedMessages.length > 1 && (
                        <div
                            className={styles.expandPinnedMessages}
                            onClick={() =>
                                setExpandedPinnedMessages(!expandedPinnedMessages)
                            }>
                            {expandedPinnedMessages ? (
                                <div className={styles.expandMessagesContent}>
                                    show less <ExpandLessRoundedIcon />
                                </div>
                            ) : (
                                <div className={styles.expandMessagesContent}>
                                    show more <ExpandMoreRoundedIcon />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.messagesContainer}>
                    {messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            newMessage={message}
                            setReplyMessage={setReplyMessage}
                            replyMessage={message.replyMessage}
                            room={room}
                            socket={socket}
                            pinnedMessages={pinnedMessages}
                            inputRef={textInput}
                        />
                    ))}
                    <div ref={messagesRef}></div>
                </div>
            </div>
            <div className={styles.chatInputContainer}>
                <div
                    className={styles.chatInput}
                    onClick={() => textInput.current.focus()}>
                    <div className={styles.inputContent}>
                        {replyMessage !== '' && (
                            <div className={styles.replyMessage}>
                                <p className={styles.replyMessageText}>{replyMessage}</p>
                                <CloseRoundedIcon
                                    fontSize='small'
                                    className={styles.dismissReply}
                                    onClick={() => setReplyMessage('')}
                                />
                            </div>
                        )}
                        <StyledTextField
                            inputRef={textInput}
                            variant='standard'
                            multiline
                            placeholder='Message ...'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            InputProps={{
                                disableUnderline: true,
                                style: { color: 'var(--replyTextColor)' },
                            }}
                        />
                    </div>
                    <SendRoundedIcon
                        onClick={() => handleSendMessage()}
                        style={{
                            opacity: `${message !== '' ? '0.5' : '0.2'}`,
                            padding: `${replyMessage !== '' ? '14px' : '12px'} 10px 0 0`,
                            margin: '0',
                            cursor: 'pointer',
                            position: 'sticky',
                            top: '0',
                            justifySelf: 'end',
                            color: 'var(--iconColor)',
                        }}
                        fontSize='small'
                    />
                </div>
                {Object.keys(nowPlaying).length > 0 && (
                    <div className={styles.pillContainer}>
                        <b className={styles.quickAddText}>Quick Add:</b>

                        <QuickAddPill
                            nowPlaying={nowPlaying}
                            message={message}
                            setMessage={setMessage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
