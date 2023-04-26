import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	userDisplayName: String,
	profilePic: String,
	userIsActive: Boolean,
	userStudios: [{ type: Schema.Types.ObjectId, ref: "Studio" }],
});

const studioSchema = new Schema({
	studioName: String,
	studioIsActive: Boolean,
	studioUsers: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
	studioHost: { type: Schema.Types.ObjectId, ref: "User" },
	studioGenres: [String],
	studioPicture: String,
	studioControlHostOnly: Boolean,
});

const chatSchema = new Schema({
	roomId: String,
	messages: [{ username: String, message: String }],
});

const User = mongoose.model("User", userSchema);
const Studio = mongoose.model("Studio", studioSchema);
const Chat = mongoose.model("Chat", chatSchema);

export { User, Studio, Chat };
