import express from 'express';
const router = express.Router();


import { login, logout, register, uploadMedia, getProfileById, searchAccount, updateProfile, deleteAccount, followUnfollow, followingList, followersList, suggestedUsers } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
// import { uploadFile } from '../middlewares/multer.js';



// Routes

router.post('/uploadFile', uploadMedia)

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/profile/:id', isAuthenticated, getProfileById);
router.put('/updateProfile', isAuthenticated, updateProfile);   // only loggedIn user can update their own profile
router.put('/delete', isAuthenticated, deleteAccount);   // only loggedIn user can delete their own account
router.get('/search', isAuthenticated, searchAccount);

// follow-unfollow
router.get('/followUnfollow/:id', isAuthenticated, followUnfollow);

// Follower-Follwing list of user by Id
router.get('/followingList/:id', isAuthenticated, followingList);
router.get('/followersList/:id', isAuthenticated, followersList);
router.get('/suggestedUsers', isAuthenticated, suggestedUsers);



export default router;