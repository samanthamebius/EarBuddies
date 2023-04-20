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
    { studioName: 'Software Swifties', studioIsActive: true, studioGenres: ['country', 'pop'], studioPicture: 'softwareswifties.png', studioUsers: [] },
    { studioName: 'Country Crew', studioIsActive: false, studioGenres: ['country'], studioPicture: 'countrycrew.png', studioUsers: [] },
    { studioName: 'Tune Team', studioIsActive: true, studioGenres: ['country', 'pop'], studioPicture: 'tuneteam.png', studioUsers: [] },
    { studioName: 'Sad Club', studioIsActive: false, studioGenres: ['pop'], studioPicture: 'sadclub.png', studioUsers: [] },
    { studioName: 'Sound Scholars', studioIsActive: true, studioGenres: ['Lo-Fi'], studioPicture: 'soundscholars.png', studioUsers: [] },
    { studioName: 'BLINKS', studioIsActive: false, studioGenres: ['K-Pop'], studioPicture: 'blinks.png', studioUsers: [] }
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

