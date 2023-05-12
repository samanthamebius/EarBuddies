import { Chat } from '../database/schema';

/**
 * gets chat from id
 * @param id
 * @returns chat
 */
async function getChat(id) {
	return await Chat.findOne({ roomId: id.toString() });
}

/**
 * creates a chat and saves it to the database
 * @param id
 */
async function createChat(id) {
	const dbChat = new Chat({ roomId: id, messages: [] });
	dbChat.save();
}

/**
 * gets all the messages and pinned messages from a chat
 * @param id
 * @returns messages and pinnedMessages
 */
async function getMessages(id) {
	return await Chat.findOne(
		{ roomId: id.toString() },
		{ messages: 1, pinnedMessages: 1 }
	);
}

/**
 * adds a new message to the chat and saves it to the database
 * @param id
 * @param message
 * @returns messages
 */
async function addANewMessage(id, message) {
	if (message.message !== 'Now playing: ') {
		return await Chat.updateOne(
			{ roomId: id.toString() },
			{ $push: { messages: message } }
		);
	}
}

/**
 * adds a new pinned message to the chat and saves it to the database
 * @param id
 * @param pinnedMessage
 * @returns pinnedMessages
 */
async function addANewPinnedMessage(id, pinnedMessage) {
	return await Chat.updateOne(
		{ roomId: id.toString() },
		{ $push: { pinnedMessages: pinnedMessage } }
	);
}

/**
 * remove a pinned message from the chat
 * @param id
 * @param pinnedMessage
 * @returns updated pinnedMessages
 */
async function removePinnedMessage(id, pinnedMessage) {
	return await Chat.updateOne(
		{
			roomId: id.toString(),
		},
		{ $pull: { pinnedMessages: { id: pinnedMessage.id } } }
	);
}

/**
 * get a specific reaction for a message
 * @param id
 * @param messageId
 * @param reaction
 * @returns reaction
 */
async function getReactionWithUsername(id, messageId, reaction) {
	return await Chat.findOne({
		roomId: id.toString(),
		messages: {
			$elemMatch: { id: messageId, 'reactions.username': reaction.username },
		},
	});
}

/**
 * add a reaction into chat
 * @param id
 * @param messageId
 * @param reaction
 * @returns update message
 */
async function addANewReaction(id, messageId, reaction) {
	return await Chat.findOneAndUpdate(
		{ roomId: id.toString(), 'messages.id': messageId },
		{ $push: { 'messages.$.reactions': reaction } }
	);
}

/**
 * update a previous reaction
 * @param id
 * @param messageId
 * @param reaction
 * @returns updated reaction
 */
async function updateReaction(id, messageId, reaction) {
	return await Chat.updateOne(
		{
			roomId: id.toString(),
			'messages.id': messageId,
		},
		{
			$set: {
				'messages.$[message].reactions.$[reaction].label': reaction.label,
			},
		},
		{
			arrayFilters: [
				{ 'message.id': messageId },
				{ 'reaction.username': reaction.username },
			],
		}
	);
}

/**
 * update the display name of a user in chat
 * @param username
 * @param studioId
 * @param nickname
 * @returns updated chat
 */
async function updateChatMessageDisplayName(username, studioId, nickname) {
	await Chat.findOneAndUpdate(
		{
			roomId: studioId.toString(),
			'messages.username': username,
		},
		{
			$set: {
				'messages.$[message].displayName': nickname,
			},
		},
		{
			arrayFilters: [{ 'message.username': username }],
		}
	);

	return await getChat(studioId);
}

/**
 * deletes chat in db
 * @param id
 * @returns deleted chat
 */
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
	updateChatMessageDisplayName,
	deleteChat,
};
