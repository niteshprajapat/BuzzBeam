import express, { request } from 'express';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import storyRoutes from './routes/story.routes.js';

import { cloudinaryConfig } from './config/cloudinary.js';



// Pwd change and update
// Pwd Forgot and update
// Pwd reset mail api and update



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
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));



const startServer = async () => {
    connectDB();


    // Routes Middleare
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/posts', postRoutes);
    app.use('/api/v1/comments', commentRoutes);
    app.use('/api/v1/messages', messageRoutes);
    app.use('/api/v1/notifications', notificationRoutes);
    app.use('/api/v1/story', storyRoutes);


    // App Home Page
    app.get('/', (req, res) => {
        console.log(req.headers.origin);
        console.log(req.headers.host);

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














