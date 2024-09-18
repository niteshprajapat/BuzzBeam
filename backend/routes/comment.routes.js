import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createComment, deleteComment, updateComment, getAllCommentByPostId, likeUnlikeComment } from '../controllers/comment.controller.js';



// Routes
router.post('/createComment/:id', isAuthenticated, createComment);
router.put('/updateComment/:id', isAuthenticated, updateComment);
router.delete('/deleteComment/:id', isAuthenticated, deleteComment);
router.get('/getAllComments/:id', isAuthenticated, getAllCommentByPostId);
router.get('/likeUnlikeComment/:id', isAuthenticated, likeUnlikeComment);

export default router;