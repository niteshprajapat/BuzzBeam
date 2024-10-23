import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { deleteAllNotifications, deleteNotificationById, getAllNotifications, readAllNotifications, readNotifiicationById } from '../controllers/notification.controller.js';



// Routes

router.get("/getAllNotifications", isAuthenticated, getAllNotifications);


// Mark Notification as Read
// Mark All Notification as Read

router.get("/readNotification/:id", isAuthenticated, readNotifiicationById);
router.get("/readAllNotifications", isAuthenticated, readAllNotifications);


// Delete Notifiaction by Id
// Delete All Notifiaction of LoggedIn User

router.delete("/deleteNotification/:id", isAuthenticated, deleteNotificationById);
router.delete("/deleteAllNotifications", isAuthenticated, deleteAllNotifications);








export default router;