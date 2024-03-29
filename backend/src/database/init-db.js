import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Studio } from './schema';

//dummy user data for testing
const users = [
	{
		username: 'sam123',
		userDisplayName: 'Samantha Mebius',
		profilePic: '/src/assets/profile/penguin.png',
		userIsActive: true,
		userStudios: [],
	},
	{
		username: 'bre456',
		userDisplayName: 'Breanna Jury',
		profilePic: '/src/assets/profile/snail.png',
		userIsActive: false,
		userStudios: [],
	},
	{
		username: 'ananya789',
		userDisplayName: 'Ananya Ahluwalia',
		profilePic: '/src/assets/profile/bunny.png',
		userIsActive: true,
		userStudios: [],
	},
	{
		username: 'amy123',
		userDisplayName: 'Amy Rimmer',
		profilePic: '/src/assets/profile/clown-fish.png',
		userIsActive: false,
		userStudios: [],
	},
	{
		username: 'ange456',
		userDisplayName: 'Angela Lorusso',
		profilePic: '/src/assets/profile/panda.png',
		userIsActive: true,
		userStudios: [],
	},
	{
		username: 'yuewen789',
		userDisplayName: 'Yuewen Zheng',
		profilePic: '/src/assets/profile/giraffe.png',
		userIsActive: false,
		userStudios: [],
	},
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
	console.log('Inserted new users!');

	await mongoose.disconnect();
	console.log('Disconnected from database!');
}
