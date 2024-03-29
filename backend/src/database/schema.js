import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	userDisplayName: String,
	spotifyPic: String,
	profilePic: String,
	userIsActive: Boolean,
	userStudios: [{ type: Schema.Types.ObjectId, ref: "Studio" }],
});

const studioSchema = new Schema({
    studioName: String,
    studioIsActive: Boolean,
    studioUsers: [{ type: String, required: true }],
	studioNames: [String],
    studioHost: String,
    studioGenres: [String],
    studioPicture: String,
    studioControlHostOnly: Boolean,
    studioPlaylist: String,
});

const chatSchema = new Schema({
	roomId: String,
	messages: [
		{
			id: String,
			username: String,
			displayName: String,
			message: String,
			isReply: Boolean,
			replyMessage: String,
			reactions: [
				{ id: String, label: String, username: String, displayName: String },
			],
		},
	],
	pinnedMessages: [
		{ id: String, message: String, username: String, displayName: String },
	],
});

const User = mongoose.model("User", userSchema);
const Studio = mongoose.model("Studio", studioSchema);
const Chat = mongoose.model("Chat", chatSchema);

export { User, Studio, Chat };
