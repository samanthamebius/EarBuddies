import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import * as url from 'url';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

// setup express
const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());

// Setup body-parser
app.use(express.json());

// Setup our routes.
import routes from './routes';
app.use('/', routes);

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Make the "public" folder available statically
app.use(express.static(path.join(dirname, '../public')));

// Setup server for in-app messaging
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
});

/**
 * Setup socket connection
 * has all the socket.on then emit code from chat and studio
 * */
io.on('connection', (socket) => {
	// add a user to a studio chat
	socket.on('join_room', (data) => {
		const { id } = data;
		socket.join(id); // let the user join the room
	});

	// send message to users with room id
	socket.on('send_message', (data) => {
		const { room } = data;
		io.in(room).emit('receive_message', data);
	});

	// send pinned messages to users
	socket.on('send_pinned_message', (data) => {
		const { room } = data;
		io.in(room).emit('receive_pinned_message', data);
	});

	// send removed pinned messages to users
	socket.on('remove_pinned_message', (data) => {
		const { room } = data;
		io.in(room).emit('receive_remove_pinned_message', data);
	});

	// send the message reaction to users
	socket.on('send_message_reaction', (data) => {
		const { room } = data;
		io.in(room).emit('receive_message_reaction', data);
	});

	// reload the chat messages if the nickname of users in the studio changes
	socket.on('reload_chat_messages', (data) => {
		const { room } = data;
		io.in(room).emit('receive_reload_chat_messages', data);
	});

	// send the currently playing song to the chat
	socket.on('send_currently_playing', (data) => {
		const { room, track } = data;
		io.in(room).emit('receive_currently_playing', track);
	});

	// add a song to the queue
	socket.on('send_new_song', (data) => {
		const { room } = data;
		io.in(room).emit('receive_new_song', data);
	});

	// remove song from the queue
	socket.on('remove_from_studio_queue', (data) => {
		const { room } = data;
		io.in(room).emit('receive_remove_from_studio_queue', data);
	});

	// play a song from the playlist in studio
	socket.on('send_play_song', (data) => {
		const { room } = data;
		io.in(room).emit('receive_play_song', data);
	});

	// pause a song from the playlist in studio
	socket.on('send_pause_song', (data) => {
		const { room } = data;
		io.in(room).emit('receive_pause_song', data);
	});

	// send the user's currently playing song to chat
	socket.on('send_to_chat_currently_playing', (data) => {
		const { room } = data;
		io.in(room).emit('receive_user_currently_playing_song', data);
	});

	// send new host to users so they can see if they are new host
	socket.on('send_new_host', (data) => {
		const { room } = data;
		io.in(room).emit('receive_new_host', data.newHost);
	});

	// remove the user so they don't receive messages while they are gone
	socket.on('leave_room', (data) => {
		const { nickname: displayName, room } = data;
		socket.leave(room);
	});
});

// Serve up the frontend's "dist" directory, if we're running in production mode.
if (process.env.NODE_ENV === 'production') {
	// Make all files in that folder public
	app.use(express.static(path.join(dirname, '../../frontend/dist')));

	// If we get any GET request we can't process using one of the server routes, serve up index.html by default.
	app.get('*', (req, res) => {
		res.sendFile(path.join(dirname, '../../frontend/dist/index.html'));
	});
}

mongoose
	.connect(process.env.DB_URL, { useNewUrlParser: true })
	.then(() =>
		server.listen(port, () => console.log(`App server listening on port ${port}!`))
	);
