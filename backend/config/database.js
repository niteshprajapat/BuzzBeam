import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDb connected Successfully!");
    } catch (error) {
        console.log("Unable to Connect MongoDb", error);
    }
}