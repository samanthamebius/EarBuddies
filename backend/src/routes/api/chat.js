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

// get all messages in the chat room
router.get("/all-messages/:id", async (req, res) => {
	const { id } = req.params;
	const messages = await Chat.findOne(
		{ roomId: id.toString() },
		{ messages: 1 }
	);
	res.status(200).json(messages);
});

export default router;
