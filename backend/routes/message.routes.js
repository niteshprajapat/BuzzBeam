import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';



// Routes

router.post('/sendMessage/:id', isAuthenticated, sendMessage);
router.get('/getMessages/:id', isAuthenticated, getMessages);


export default router;