import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getAllNotifications } from '../controllers/notification.controller.js';



// Routes

router.get("/getAllNotifications", isAuthenticated, getAllNotifications);


// Mark Notification as Read
// Mark All Notification as Read

// Delete Notifiaction by Id
// Delete All Notifiaction of LoggedIn User






export default router;