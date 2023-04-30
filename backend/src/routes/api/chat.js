import express from "express";
import { Chat } from "../../database/schema";

const router = express.Router();

// create a new chat
router.post("/:id", async (req, res) => {
	const { id } = req.params;
	const dbChat = await Chat.findOne({ roomId: id.toString() });

	// create the chat if it doesn't already exist
	if (!dbChat) {
		const dbChat = new Chat({ roomId: id, messages: [] });
		dbChat.save();
	}

	res.sendStatus(201);
});

// get all messages in the chat room
router.get("/all-messages/:id", async (req, res) => {
	const { id } = req.params;
	const messages = await Chat.findOne(
		{ roomId: id.toString() },
		{ messages: 1, pinnedMessages: 1 }
	);

	res.status(200).json(messages);
});

// update message history
router.put("/new-message/:id", async (req, res) => {
	const { id } = req.params;
	const message = req.body;

	const success = await Chat.updateOne(
		{ roomId: id.toString() },
		{ $push: { messages: message } }
	);

	res.sendStatus(success ? 204 : 404);
});

// update pinned message history
router.put("/pinned-messages/:id", async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = await Chat.updateOne(
		{ roomId: id.toString() },
		{ $push: { pinnedMessages: pinnedMessage } }
	);

	res.sendStatus(success ? 204 : 404);
});

// delete pinned message
router.put("/remove-pinned-message/:id", async (req, res) => {
	const { id } = req.params;
	const pinnedMessage = req.body;

	const success = await Chat.updateOne(
		{
			roomId: id.toString(),
		},
		{ $pull: { pinnedMessages: { id: pinnedMessage.id } } }
	);

	res.sendStatus(success ? 204 : 404);
});

// add a new or update the reaction
router.put("/new-reaction/:id", async (req, res) => {
	const { id } = req.params;
	const { messageId, reaction } = req.body;

	const dbReaction = await Chat.findOne({
		roomId: id.toString(),
		messages: {
			$elemMatch: { id: messageId, "reactions.username": reaction.username },
		},
	});

	var success = {};

	if (!dbReaction) {
		// add the reaction
		success = await Chat.findOneAndUpdate(
			{ roomId: id.toString(), "messages.id": messageId },
			{ $push: { "messages.$.reactions": reaction } }
		);
	} else {
		// update the reaction
		success = await Chat.updateOne(
			{
				roomId: id.toString(),
				"messages.id": messageId,
			},
			{
				$set: {
					"messages.$[message].reactions.$[reaction].label": reaction.label,
				},
			},
			{
				arrayFilters: [
					{ "message.id": messageId },
					{ "reaction.username": reaction.username },
				],
			}
		);
	}

	res.sendStatus(success ? 204 : 404);
});

export default router;
