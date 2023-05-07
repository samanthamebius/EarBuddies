import mongoose from "mongoose";

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	userDisplayName: String,
	spotifyPic: String,
	profilePic: String,
	userIsActive: Boolean,
	userStudios: [{ type: Schema.Types.ObjectId, ref: "Studio" }]
});

var studioSchema = new Schema({
	studioName: String,
	studioIsActive: Boolean,
	studioUsers: [{ type: String, required: true }],
	studioHost: String,
	studioGenres: [String],
	studioPicture: String,
	studioControlHostOnly: Boolean,
	studioPlaylist: String
});

var chatSchema = new Schema({
	roomId: String,
	messages: [{
		id: String,
		username: String,
		displayName: String,
		message: String,
		isReply: Boolean,
		replyMessage: String,
		reactions: [{ id: String, label: String, username: String, displayName: String }]
	}],
	pinnedMessages: [{ id: String, message: String, username: String, displayName: String }]
});

var User = mongoose.model("User", userSchema);
var Studio = mongoose.model("Studio", studioSchema);
var Chat = mongoose.model("Chat", chatSchema);

export { User, Studio, Chat };