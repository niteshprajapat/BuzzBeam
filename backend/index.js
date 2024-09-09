import express from 'express';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import { cloudinaryConfig } from './config/cloudinary.js';



// Configuration
dotenv.config({});
cloudinaryConfig();

// Initialization
const app = express();
const port = process.env.PORT;

// Middleare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
// asas
// }))

const startServer = async () => {
    connectDB();


    // Routes Middleare
    app.use('/api/v1/users', userRoutes)


    // App Home Page
    app.get('/', (req, res) => {
        return res.status(200).json({
            success: true,
            message: "This is Home Page of BuzzBeam",
        });
    });


    // App Listen
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}

startServer();














