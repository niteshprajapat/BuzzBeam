import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createPost, deletePost, getAllPosts, getLoggedInUserPost, getPostById, updatePostById, likeUnlikePost, savePost, uploadMedia } from '../controllers/post.controller.js';



// Routes

router.post('/uploadFile', uploadMedia)


router.post('/createPost', isAuthenticated, createPost);
router.get('/getAllPosts', isAuthenticated, getAllPosts); // Need to work on this, as data need to populate for likes,cmts, user
router.get('/getPostById/:id', isAuthenticated, getPostById); // Need to work on this, as data need to populate for likes,cmts, user
router.put('/updatePost/:id', isAuthenticated, updatePostById); // Need to work on this, as data need to populate for likes,cmts, user
router.get('/getLoggedInUserPost', isAuthenticated, getLoggedInUserPost); // LoggedIn User's post


// likeUnlikePost - Delete & savePost
router.get('/likeUnlikePost/:id', isAuthenticated, likeUnlikePost);
router.delete('/deletePost/:id', isAuthenticated, deletePost)
router.get('/savePost/:id', isAuthenticated, savePost);

export default router;