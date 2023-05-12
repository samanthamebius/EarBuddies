import express from 'express';
import {
	getChat,
	createChat,
	getMessages,
	addANewMessage,
	addANewPinnedMessage,
	getReactionWithUsername,
	removePinnedMessage,
	addANewReaction,
	updateReaction,
} from '../../dao/chat_dao';

const router = express.Router();

/**
 * @route   POST api/chat/:id
 * @desc    Create a chat room
 * @params   id: String
 * @returns  201 if successful
 */
router.post('/:id', async (req, res) => {
	const { id } = req.params;
	const dbChat = await getChat(id);

	// create the chat if it doesn't already exist
	if (!dbChat) {
		await createChat(id);
	}

	res.sendStatus(201);
});

/**
 * @route   GET api/chat/all-messages/:id
 * @desc    Get all messages from a chat room
 * @params  id: String
 * @returns 200 if successful
 */
router.get('/all-messages/:id', async (req, res) => {
	const { id } = req.params;
	const messages = await getMessages(id);
	res.status(200).json(messages);
});

/**
 * @route   PUT api/chat/new-message/:id'
 * @desc    Get new messages and update the chat history
 * @params  id: String
 * @body 	message: String
 * @returns 204 if successful
 * @throws  404 if unsuccessful
 */
router.put('/new-message/:id', async (req, res) => {
	const { id } = req.params;
	const message = req.body;

	const success = await addANewMessage(id, message);

	res.sendStatus(success ? 204 : 404);
});

/**
 * @route   PUT api/chat/pinned-messages/:id
 * @desc    Get all pinned messages from a chat room and show them
 * @params  id: String
 * @body 	pinnedMessage: Object
 * @returns 204 if successful
 * @throws  404 if unsuccessful
 */
router.put('/pinned-messages/:id', async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = await addANewPinnedMessage(id, pinnedMessage);

	res.sendStatus(success ? 204 : 404);
});

/**
 * @route   PUT api/chat/remove-pinned-message/:id
 * @desc    Remove a pinned message from a chat room
 * @params  id: String
 * @body 	pinnedMessage: Object
 * @returns 204 if successful
 * @throws  404 if unsuccessful
 */
router.put('/remove-pinned-message/:id', async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = removePinnedMessage(id, pinnedMessage);

	res.sendStatus(success ? 204 : 404);
});

/**
 * @route   PUT api/chat/new-reaction/:id
 * @desc    Add a new reaction to a message or update an existing reaction
 * @params  id: String
 * @body 	messageId: String
 * 		 	reaction: String
 * @returns 204 if successful
 * @throws  404 if unsuccessful
 */
router.put('/new-reaction/:id', async (req, res) => {
	const { id } = req.params;
	const { messageId, reaction } = req.body;

	const dbReaction = await getReactionWithUsername(id, messageId, reaction);

	var success = {};

	if (!dbReaction) {
		// add the reaction
		success = await addANewReaction(id, messageId, reaction);
	} else {
		// update the reaction
		success = await updateReaction(id, messageId, reaction);
	}

	res.sendStatus(success ? 204 : 404);
});

export default router;
