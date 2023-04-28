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

	console.log(reaction);

	// check if a reaction by the given username exists
	// const dbReaction = await Chat.findOne({
	// 	roomId: id.toString(),
	// 	"messages.id": messageId,
	// 	"messages.reactions.username": reaction.username,
	// });

	const dbReaction = await Chat.find({
		roomId: id.toString(),
		"messages.id": messageId,
	}).where("messages.reactions.username");

	var success = {};

	success = await Chat.findOneAndUpdate(
		{ roomId: id.toString(), "messages.id": messageId },
		{ $push: { "messages.$.reactions": reaction } }
	);

	// if (!dbReaction) {
	// 	// add a new reaction if one doesn't already exist
	// 	success = await Chat.findOneAndUpdate(
	// 		{ roomId: id.toString(), "messages.id": messageId },
	// 		{ $push: { "messages.$.reactions": reaction } }
	// 	);
	// } else {
	// 	console.log("existing");
	// 	// update the existing reaction
	// 	// success = await Chat.findOneAndUpdate(
	// 	// 	{
	// 	// 		roomId: id.toString(),
	// 	// 		"messages.id": messageId,
	// 	// 		"messages.reactions.username": reaction.username,
	// 	// 	},
	// 	// 	{
	// 	// 		$set: {
	// 	// 			"messages.$.reactions": {
	// 	// 				id: reaction.id,
	// 	// 				label: reaction.label,
	// 	// 				username: reaction.username,
	// 	// 				displayName: reaction.displayName,
	// 	// 			},
	// 	// 		},
	// 	// 	}
	// 	// );

	// 	success = await Chat.find({
	// 		roomId: id.toString(),
	// 		"messages.id": messageId,
	// 	})
	// 		.where("messages.reactions.username")
	// 		.equals(reaction.username)
	// 		.updateOne({
	// 			$set: {
	// 				"messages.$.reactions": {
	// 					id: reaction.id,
	// 					label: reaction.label,
	// 					username: reaction.username,
	// 					displayName: reaction.displayName,
	// 				},
	// 			},
	// 		});
	// }

	res.sendStatus(success ? 204 : 404);
});

export default router;
