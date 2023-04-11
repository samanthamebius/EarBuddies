import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {type: String, unique: true},
    username: String,
    profilePic: String,
    userIsActive: Boolean,
    userStudios: [{type: Schema.Types.ObjectId, ref: 'Studio'}]
});

const studioSchema = new Schema({
    studioID: {type: Integer, unique: true},
    studioName: String,
    studioIsActive: Boolean,
    studioUsers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    studioHost: {type: Schema.Types.ObjectId, ref: 'User'},
    studioGenres: [String],
    studioPicture: String
});

const User = mongoose.model('User', userSchema);
const Studio = mongoose.model('Studio', studioSchema);

export {User, Studio};