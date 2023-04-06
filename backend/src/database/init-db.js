import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

main();

async function main() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log('Connected to database!');

    //TODO functions for clearing database and adding schema data to database
    



    // Disconnect when complete
    await mongoose.disconnect();
    console.log('Disconnected from database!');
}

