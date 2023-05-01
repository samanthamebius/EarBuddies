import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";
import mongoose from "mongoose";

await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

async function createStudio(name, listeners, host, genres, photo, isHostOnly) {
  const newStudio = new Studio({
    studioName: name,
    studioIsActive: true,
    studioUsers: listeners,
    studioHost: host,
    studioGenres: genres,
    studioPicture: photo,
    studioControlHostOnly: isHostOnly,
  });
  const studio = await newStudio.save();
  return studio;
}

async function getStudio(id) {
    return await Studio.find({ _id: id });
}

async function deleteStudio(id) {
    return await Studio.deleteOne({ _id: id });
}

async function getStudios() {
    return await Studio.find();
}

async function updateStudioControlHostOnly(id, isHostOnly) {
    return await Studio.findOneAndUpdate({ _id: id }, { studioControlHostOnly: isHostOnly });
}

async function updateStudioIsActive(id, isActive) {
    return await Studio.findOneAndUpdate({ _id: id }, { studioIsActive: isActive });
}

async function updateStudioUsers(id, listeners) {
    return await Studio.findOneAndUpdate({ _id: id }, { studioUsers: listeners });
}

async function updateStudioHost(id, host) {
    return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host });
}

await mongoose.disconnect;
export { 
    createStudio, 
    getStudio, 
    getStudios, 
    updateStudioControlHostOnly, 
    updateStudioIsActive, 
    updateStudioUsers, 
    updateStudioHost,
    deleteStudio 
};

