import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

const users = [
    { username: 'smeb123', userDisplayName: "Samantha Mebius", profilePic: "avatar1.png", userIsActive: true, userStudios: [] },
    { username: 'bre123', userDisplayName: "Breanna Jury", profilePic: "avatar2.png", userIsActive: false, userStudios: [] },
    { username: 'ananya456', userDisplayName: "Ananya Ahluwalia", profilePic: "avatar3.png", userIsActive: true, userStudios: [] },
    { username: 'amy456', userDisplayName: "Amy Rimmer", profilePic: "avatar4.png", userIsActive: false, userStudios: [] },
    { username: 'ange789', userDisplayName: "Angela Lorusso", profilePic: "avatar5.png", userIsActive: true, userStudios: [] },
    { username: 'yuewen789', userDisplayName: "Yuewen Zheng", profilePic: "avatar6.png", userIsActive: false, userStudios: [] }
];

const studios = [
    { studioName: 'Software Swifties', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'bre\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'ananya\'s studio', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'amy\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'ange\'s studio', studioIsActive: true, studioGenres: ['rock', 'pop', 'jazz'] },
    { studioName: 'yuewen\'s studio', studioIsActive: false, studioGenres: ['rock', 'pop', 'jazz'] }
];

main();

async function main() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log('Connected to database!');
    console.log();

    await User.deleteMany({});
    await Studio.deleteMany({});
    console.log('Deleted all users and studios!');

    await User.insertMany(users);
    await Studio.insertMany(studios);
    console.log('Inserted new users and studios!');

    await mongoose.disconnect();
    console.log('Disconnected from database!');
}

