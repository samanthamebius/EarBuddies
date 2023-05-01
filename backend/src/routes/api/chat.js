import express from "express";
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
} from "../../database/chat_dao";

const router = express.Router();

// create a new chat
router.post("/:id", async (req, res) => {
	const { id } = req.params;
	const dbChat = await getChat(id);

	// create the chat if it doesn't already exist
	if (!dbChat) {
		await createChat(id);
	}

	res.sendStatus(201);
});

// get all messages in the chat room
router.get("/all-messages/:id", async (req, res) => {
	const { id } = req.params;
	const messages = await getMessages(id);
	res.status(200).json(messages);
});

// update message history
router.put("/new-message/:id", async (req, res) => {
	const { id } = req.params;
	const message = req.body;

	const success = await addANewMessage(id, message);

	res.sendStatus(success ? 204 : 404);
});

// update pinned message history
router.put("/pinned-messages/:id", async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = await addANewPinnedMessage(id, pinnedMessage);

	res.sendStatus(success ? 204 : 404);
});

// delete pinned message
router.put("/remove-pinned-message/:id", async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = removePinnedMessage(id, pinnedMessage);

	res.sendStatus(success ? 204 : 404);
});

// add a new or update the reaction
router.put("/new-reaction/:id", async (req, res) => {
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
