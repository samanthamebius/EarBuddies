import mongoose from "mongoose";
import { Chat } from "../database/schema";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function getChat(id) {
	return await Chat.findOne({ roomId: id.toString() });
}

async function createChat(id) {
	const dbChat = new Chat({ roomId: id, messages: [] });
	dbChat.save();
}

async function getMessages(id) {
	return await Chat.findOne(
		{ roomId: id.toString() },
		{ messages: 1, pinnedMessages: 1 }
	);
}

async function addANewMessage(id, message) {
	return await Chat.updateOne(
		{ roomId: id.toString() },
		{ $push: { messages: message } }
	);
}

async function addANewPinnedMessage(id, pinnedMessage) {
	return await Chat.updateOne(
		{ roomId: id.toString() },
		{ $push: { pinnedMessages: pinnedMessage } }
	);
}

async function removePinnedMessage(id, pinnedMessage) {
	return await Chat.updateOne(
		{
			roomId: id.toString(),
		},
		{ $pull: { pinnedMessages: { id: pinnedMessage.id } } }
	);
}

async function getReactionWithUsername(id, messageId, reaction) {
	return await Chat.findOne({
		roomId: id.toString(),
		messages: {
			$elemMatch: { id: messageId, "reactions.username": reaction.username },
		},
	});
}

async function addANewReaction(id, messageId, reaction) {
	return await Chat.findOneAndUpdate(
		{ roomId: id.toString(), "messages.id": messageId },
		{ $push: { "messages.$.reactions": reaction } }
	);
}

async function updateReaction(id, messageId, reaction) {
	return await Chat.updateOne(
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

//delete chat of a room
async function deleteChat(id) {
	return await Chat.deleteOne({ roomId: id.toString() });
}

export {
	getChat,
	createChat,
	getMessages,
	addANewMessage,
	addANewPinnedMessage,
	removePinnedMessage,
	getReactionWithUsername,
	addANewReaction,
	updateReaction,
	deleteChat,
};
