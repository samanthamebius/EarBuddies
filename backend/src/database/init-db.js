import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

main();

async function main() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log('Connected to database!');
    console.log();

    await clearDatabase();
    console.log();

    //TODO add scema to db??

    console.log();

    // Disconnect when complete
    await mongoose.disconnect();
    console.log('Disconnected from database!');
}

async function clearDatabase() {
    // const articlesDeleted = await Article.deleteMany({});
    console.log(`Cleared database (removed ${articlesDeleted.deletedCount} articles).`);
}